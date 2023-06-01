import * as shell from "shelljs";
import {installDependencies as installMacDependencies} from "../mac-dependency-check";
import {installDependencies as installLinuxDependencies} from "../linux-dependency-check";
import {logTerminal} from "../logs";
import * as colors from "colors";
import { Listr, PRESET_TIMER } from 'listr2'
import pTimeout from 'p-timeout';

const inquirer = require('inquirer');
const ghp = process.env.GITHUB_PACKAGE_TOKEN;
let tokenIsSet:boolean;

export function checkToken(): boolean{
  if (ghp==undefined || !ghp.startsWith("ghp_")){
    console.log("The "+ colors.bold.red("GITHUB_PACKAGE_TOKEN")+" environment variable is not set - packages' version can not be queried")
    tokenIsSet = false
  }
  else{
    console.log("The "+ colors.bold.green("GITHUB_PACKAGE_TOKEN")+" environment variable is set - packages' version can be queried")
    tokenIsSet = true
  }
  return tokenIsSet
}

export function dependencyCheck(verbose: boolean) :boolean {
  // macOS check
  switch (process.platform) {
    case 'darwin':
      return installMacDependencies(verbose)
    case 'linux':
      return installLinuxDependencies(verbose)
    default:
      logTerminal('ERROR', 'Operating system unsupported at this time')
      return false
  }
}

export async function getCurrentRepoTag() {
  const repos = ['openline-customer-os', 'openline-trackers'];
  const {repo} = await inquirer.prompt([
    {
      type: 'list',
      name: 'repo',
      message: 'Select the repository source for the release:',
      choices: repos,
    },
  ]);

  const latestTag = `curl -s -L -H "Accept: application/vnd.github+json" https://api.github.com/repos/openline-ai/${repo}/releases/latest | grep -o '"tag_name": "[^"]\\+"'  | cut -d'"' -f4`

  return [shell.exec(latestTag, {silent: true}).stdout.trim(), repo];
}

export async function generateNewTag(tag: string) {
  const releaseTypes = ['patch', 'minor', 'Major'];
  const { releaseType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'releaseType',
      message: 'Select the release type:',
      choices: releaseTypes,
    },
  ]);

  const regex = /^v(\d+)\.(\d+)\.(\d+)-/;
  const match = tag.match(regex);
  let newTag = '';
  let stylizedNewTag = '';

  if (match) {
    const [, firstDigits, secondDigits, thirdDigits] = match;
    switch (releaseType) {
      case "Major":
        let newMajorNo  = Number(firstDigits)+1;
        if (match) {
          newTag = tag.replace(regex, (match, _, secondDigits, thirdDigits) => {
            return `v${newMajorNo}.${secondDigits}.${thirdDigits}-`;
          });
          stylizedNewTag = tag.replace(regex, (match, _, secondDigits, thirdDigits) => {
            return `v${colors.bgGreen(String(newMajorNo))}.${secondDigits}.${thirdDigits}-`;
          });
        } else {
          console.log('No match found.');
        }
        break;
      case "minor":
        let newMinorNo  = Number(secondDigits)+1;
        if (match) {
          newTag = tag.replace(regex, (match, firstDigits, _, thirdDigits) => {
            return `v${firstDigits}.${newMinorNo}.${thirdDigits}-`;
          });
          stylizedNewTag = tag.replace(regex, (match, firstDigits, _, thirdDigits) => {
            return `v${firstDigits}.${colors.bgGreen(String(newMinorNo))}.${thirdDigits}-`;
          });
        } else {
          console.log('No match found.');
        }
        break;
      case "patch":
        let newPatchNo  = Number(thirdDigits)+1;
        if (match) {
          newTag = tag.replace(regex, (match, firstDigits, secondDigits, _) => {
            return `v${firstDigits}.${secondDigits}.${newPatchNo}-`;
          });
          stylizedNewTag = tag.replace(regex, (match, firstDigits, secondDigits, _) => {
            return `v${firstDigits}.${secondDigits}.${colors.bgGreen(String(newPatchNo))}-`;
          });
        } else {
          console.log('No match found.');
        }
        break;
      default:
        console.log('Invalid condition.');
        break;
    }
  } else {
    console.log('No match found.');
  }
  return [newTag, colors.bold.red(stylizedNewTag), releaseType];
}

export async function getReleaseEnvironment() {
  const environments = ['dev', 'production'];
  const { env } = await inquirer.prompt([
    {
      type: 'list',
      name: 'env',
      message: 'On which environment do you want to release?:',
      choices: environments,
    },
  ]);
  return env;
}

function createNewTag(repo: any, newTag: string) {
  const newTaggedRelease = `curl -L -X POST -H "Authorization: Bearer ${ghp}" -H "Accept: application/vnd.github+json" https://api.github.com/repos/openline-ai/${repo}/releases -d '{"tag_name":"${newTag}","name": "${newTag}","body": "","draft": false,"prerelease": false, "make_latest": "true"}'`;
  shell.exec(newTaggedRelease, {silent: true});
}

function getPackagesForRepo(repo: any){
  const repoList = `curl -s -L -H "Authorization: Bearer ${ghp}" -H "Accept: application/vnd.github+json" 'https://api.github.com/orgs/openline-ai/packages?package_type=container' | jq '.[] | select(.repository.name == "${repo}").name'`;
  const packageListCurl = `curl -s -L -H "Authorization: Bearer ${ghp}" -H "Accept: application/vnd.github+json" 'https://api.github.com/orgs/openline-ai/packages?package_type=container' | jq '[.[] | select(.repository.name == "${repo}")]'`;
  const { stdout, stderr } = shell.exec(repoList, { silent: true });
  if (stderr) {
    console.error('An error occurred:', stderr);
    return [];
  }
  const packageList = shell.exec(packageListCurl, { silent: true, async: false }).stdout;
  const packageListArray: any[] = JSON.parse(packageList);

  const mapPackageList: Record<string, string> = {};

  packageListArray.forEach(json => {
    const { name, url } = json;
    mapPackageList[name] = url;
  });

  const packageNames = stdout.trim().split('\n').map((name) => name.replace(/"/g, ''));
  return [packageNames, mapPackageList];
}

async function getPackageVersions(packageNames: string[], newTag: string, mapPackageList: Record<string, string>) {
  let packageTask: any = [];
  const pollInterval = 10000;
  const timeoutDuration = 600000;

  console.log(colors.bold.bgRed("Waiting for new package version to be published..."))

  Object.entries(mapPackageList).forEach(([key, value]) => {
    packageTask.push({
      title: key,
      task: async (_: any) => {
        let laterValue: string = '';
        await pTimeout(
          new Promise<void>(async (resolve, reject) => {
            let elapsedTime = 0;

            while (elapsedTime < timeoutDuration) {
              try {
                let laterResponse = shell.exec(`curl -s -L -H "Authorization: Bearer ${ghp}" -H "Accept: application/vnd.github+json" '${value}/versions' | jq '.[] | select(.metadata.container.tags | contains(["latest"])) | .metadata.container.tags[] | select(. != "latest")'`, { silent: true });
                laterValue = (laterResponse).replace(/['"\n]+/g, '');

                if (laterValue === newTag) {
                  resolve();
                  return;
                }
              } catch (error) {
                // Ignore error and continue polling
              }

              await new Promise<void>((resolve) => setTimeout(resolve, pollInterval));
              elapsedTime += pollInterval;
            }

            reject(new Error(`The package was not updated from ${laterValue} to ${newTag} within ${timeoutDuration}ms`)); // Task failed, timeout reached
          }),
          timeoutDuration,
          `The package was not updated from ${laterValue} to ${newTag} within ${timeoutDuration}ms`
        );
      },
      options: {
      timer: PRESET_TIMER
    }
    })
  });

  let task: Listr<any>
  task = new Listr<any>(
    packageTask,
    {
      concurrent: true,
      exitOnError: false,
      rendererOptions: {
        collapseErrors: false
      }
    }
    )

  task.run().catch(err => {
    console.error(err);
  });
}

export async function getReleaseConfirmation(repo: any, releaseType: any, newTag: string, stylizedNewTag: string, tokenIsSet: boolean) {
  const environments = ['Yes', 'No'];
  const { releaseConfirmation } = await inquirer.prompt([
    {
      type: 'list',
      name: 'releaseConfirmation',
      message: `Are you sure you want to create the new ` + colors.bold.red(releaseType) + ` release ${stylizedNewTag} for ` + colors.bold.red(repo) + `?:`,
      choices: environments,
    },
  ]);

  if (releaseConfirmation == 'Yes'){
    createNewTag(repo, newTag);
    if(tokenIsSet) {
      const [packageNames, mapPackageList] = getPackagesForRepo(repo);
      await getPackageVersions(<string[]>packageNames, newTag, <Record<string, string>>mapPackageList);
    }
  }
}
