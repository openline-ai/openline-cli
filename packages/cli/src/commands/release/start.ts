import {Command} from "@oclif/core";
import * as colors from "colors";
import {
  generateNewTag,
  getCurrentRepoTag,
  getReleaseConfirmation,
} from "../../lib/release/release";
require('inquirer');
import * as start from '../../lib/release/release'

export default class ReleaseStart extends Command {
  static description = 'heath check to determine if openline service is up'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {}

  static args = []

  public async run(): Promise<void> {
    const {flags} = await this.parse(ReleaseStart)

    start.dependencyCheck(flags.verbose);
    let tokenIsSet = start.checkToken();
    let [tag, repo] = await getCurrentRepoTag();
    console.log(repo, '\'s current tag     : ', colors.bold.red(tag));

    let [newTag, stylizedNewTag, releaseType] = await generateNewTag(tag);
    console.log(repo, '\'s new proposed tag: ', stylizedNewTag);
    await getReleaseConfirmation(repo, releaseType, newTag, stylizedNewTag, tokenIsSet);
  }
}

