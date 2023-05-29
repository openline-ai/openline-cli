import * as shell from "shelljs";
import {installDependencies as installMacDependencies} from "../mac-dependency-check";
import {installDependencies as installLinuxDependencies} from "../linux-dependency-check";
import {logTerminal} from "../logs";
import * as colors from "colors";

const inquirer = require('inquirer');

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

export async function getReleaseConfirmation(repo: any, releaseType: any, newTag: string, stylizedNewTag: string) {
  const environments = ['Yes', 'No'];
  const { releaseConfirmation } = await inquirer.prompt([
    {
      type: 'list',
      name: 'releaseConfirmation',
      message: `\nAre you sure you want to create the new ` + colors.bold.red(releaseType) + ` release ${stylizedNewTag} for ` + colors.bold.red(repo) + `?:`,
      choices: environments,
    },
  ]);

  function createNewTag(repo: any, newTag: string) {
    const newTaggedRelease = `curl -L -X POST -H "Authorization: Bearer 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" -H "Accept: application/vnd.github+json" https://api.github.com/repos/openline-ai/${repo}/releases -d '{"tag_name":"${newTag}","name": "${newTag}","body": "","draft": false,"prerelease": false, "make_latest": "true"}'`;
    shell.exec(newTaggedRelease, {silent: true});
  }

  if (releaseConfirmation == 'Yes'){
    createNewTag(repo, newTag);
  }
}
