import {Command, Flags} from '@oclif/core'
import * as shell from 'shelljs'
import {logTerminal} from '../../lib/logs'

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
    if (flags.verbose) logTerminal('EXEC', 'colima stop')
    const reset = shell.exec('colima stop', {silent: true})
    if (reset.code === 0) {
      logTerminal('SUCCESS', 'Openline dev server stopped')
    } else {
      logTerminal('ERROR', reset.stderr, 'dev:stop')
    }
  }
}
