import {Command, Flags} from '@oclif/core'
import * as error from '../../lib/dev/errors'
import * as shell from 'shelljs'

export default class DevStop extends Command {
  static description = 'Stop and tear down the Openline development server'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    all: Flags.boolean({char: 'a'}),
    verbose: Flags.boolean({char: 'v'}),
  }

  static args = [
    {
      name: 'app',
      required: false,
      description: 'the Openline application you would like to stop',
      default: 'customer-os',
      options: ['customer-os']
    }
  ]

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(DevStop)

    let verbose = flags.verbose

    if (flags.all) {
      this.log('🦦 Stopping all Openline services...')
    }
    else if (args.app == 'customer-os') {
      this.log('🦦 Stopping customerOS...')
    }
    let reset = shell.exec('colima delete -f', {silent: !verbose})
    if (reset.code == 0) {
      '✅ all Openline services successfully stopped'
    }
    else {
      error.logError(reset.stderr, 'Run this command to nuke your instance and start over => colima delete')
    }
  }
}
