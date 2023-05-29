import {Command} from "@oclif/core";
import {ux} from "@oclif/core/lib/cli-ux";
import * as colors from "colors";
import {validate} from "@oclif/core/lib/parser/validate";
import {logTerminal} from "../../lib/logs";
import * as shell from "shelljs";
import {cli} from "cli-ux";
import {
  dependencyCheck,
  generateNewTag,
  getCurrentRepoTag,
  getReleaseConfirmation,
  getReleaseEnvironment
} from "../../lib/release/release";
import {release} from "os";
const inquirer = require('inquirer');
import * as start from '../../lib/release/release'



const Table = require('cli-table')

const { execSync } = require('child_process');



export default class ReleaseStart extends Command {
  static description = 'heath check to determine if openline service is up'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {}

  static args = []

  public async run(): Promise<void> {
    const {flags, args} = await this.parse(ReleaseStart)

    start.dependencyCheck(flags.verbose);
    let [tag, repo] = await getCurrentRepoTag();
    console.log(repo, '\'s current tag     : ', colors.bold.red(tag));

    let [newTag, stylizedNewTag, releaseType] = await generateNewTag(tag);
    console.log(repo, '\'s New proposed tag: ', stylizedNewTag);

    let confirmation = await getReleaseConfirmation(repo, releaseType, newTag, stylizedNewTag);
    // console.log('Release environment: ', environment);
    // console.log('Release environment: ', environment);


  }
}

