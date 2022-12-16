import {Command} from '@oclif/core'

export default class Dev extends Command {
  static description = 'starts and stops local development server for openline applications'

  static examples = []

  public async run(): Promise<void> {
    await this.parse(Dev)
  }
}
