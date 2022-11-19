import {Command, Flags, CliUx} from '@oclif/core'
import * as shell from 'shelljs'
import * as dev from '../../actions/devServer'
import * as mac from '../../checks/mac'


export default class DevStart extends Command {
  static description = 'Start an Openline development server'

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
      description: 'the Openline application you would like to start',
      default: 'customer-os',
      options: ['customer-os'] 
    }
  ]

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(DevStart)
    
    // Base dependency check
    let depend = mac.dependencies(flags.verbose)
    if (!depend) {
      this.exit(1)
    }

    this.log('🦦 initiating Openline dev server...')
    let start = dev.startColima(flags.verbose)
    if (start) {
      this.log('🦦 installing customerOS...this may take a few mins')
      let customerOs = dev.installCustomerOs(flags.verbose)
      if (customerOs) {
        this.log('')
        this.log('✅ customerOS started successfully!')
        this.log('🦦 To validate the service is reachable run the command =>  openline dev ping customer-os')
        this.log('🦦 Visit http://localhost:10010 in your browser to play around with the graph API explorer')
        shell.exec('open http://localhost:10010')
      }
    }
  }
}




