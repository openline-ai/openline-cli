import {Command} from '@oclif/core'

export default class Release extends Command {
  static description = 'Release openline applications'

  static examples = []

  public async run(): Promise<void> {
    await this.parse(Release)
  }
}
