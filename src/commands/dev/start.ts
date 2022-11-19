import {Command, Flags, CliUx} from '@oclif/core'
import * as checks from '../../checks/openline'
import * as shell from 'shelljs'
import * as error from '../../errors'

export default class DevStart extends Command {
  static description = 'Start an Openline development server'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    verbose: Flags.boolean({char: 'v'}),
  }

  static args = [
    {
      name: 'app',
      required: true,
      description: 'the Openline application you would like to start',
      default: 'all',
      options: ['all', 'customer-os', 'contacts', 'oasis'] 
    }
  ]

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(DevStart)
    //this.log('Starting ', args.app, flags.verbose)
    CliUx.ux.action.start('🦦 starting Openline dev server')
    startDevServer(flags.verbose)
    CliUx.ux.action.stop()
  }
}


function startDevServer(verbose :boolean) :boolean {
  let result = false
  let isRunning = checks.runningCheck(verbose)

  if (!isRunning) {
    let start = shell.exec('docker run', {silent: !verbose})
    if (start.code != 0) {
      error.logError(start.stderr, 'Try reinstalling docker', 'Link to dependencies')
    }
    else {
      result = true
    }
  }
  else {
    result = true
  }
  return result
} 

