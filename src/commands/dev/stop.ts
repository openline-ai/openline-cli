import {Command, Flags} from '@oclif/core'
import * as error from '../../lib/dev/errors'
import * as shell from 'shelljs'

export default class DevStop extends Command {
  static description = 'Stops the Openline development server & saves current config.'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    verbose: Flags.boolean({char: 'v'}),
  }

  static args = []

  public async run(): Promise<void> {
    const {flags} = await this.parse(DevStop)

    this.log('🦦 Saving current configuration...')
    this.log('🦦 Stopping Opeline dev server')
    const reset = shell.exec('colima stop', {silent: !flags.verbose})
    if (reset.code === 0) {
      '✅ Openline dev server stopped'
    } else {
      error.logError(reset.stderr, 'Run this command to nuke your instance and start over => openline dev rm --all')
    }
  }
}
