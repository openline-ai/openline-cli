import {Command, Flags, CliUx} from '@oclif/core'
import * as shell from 'shelljs'
import * as dev from '../../lib/dev/startColima'
import * as install from '../../lib/dev/installCustomerOs'
import * as mac from '../../lib/checks/mac'
import * as contacts from '../../lib/dev/installContacts'

import {installLocalCustomerOs} from '../../lib/dev/install-local-customer-os'

export default class DevStart extends Command {
  static description = 'Start an Openline development server'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    all: Flags.boolean({char: 'a'}),
    tag: Flags.string({
      char: 't',
      description: 'version tag of the image you would like to deploy',
      default: 'latest',
    }),
    location: Flags.string({
      char: 'l',
      description: 'location for the source code to be used in the installation',
      default: 'latest',
    }),
    verbose: Flags.boolean({char: 'v'}),

  }

  static args = [
    {
      name: 'app',
      required: false,
      description: 'the Openline application you would like to start',
      default: 'customer-os',
      options: ['customer-os', 'contacts'],
    },
  ]

  public async run(): Promise<void> {
    const {flags} = await this.parse(DevStart)

    // Base dependency check
    const depend = mac.dependencies(flags.verbose)
    if (!depend) {
      this.exit(1)
    }

    this.log('🦦 initiating Openline dev server...')
    const start = dev.startColima(flags.verbose)
    if (!start) {
      this.exit(1)
    }

    if (start) {
      this.log('🦦 installing customerOS...')
      const customerOsInstalled = flags.location ? installLocalCustomerOs(flags.location, flags.verbose) : install.installCustomerOs(flags.verbose, flags.tag)

      if (customerOsInstalled) {
        this.log('')
        this.log('✅ customerOS started successfully!')
        this.log('🦦 To validate the service is reachable run the command =>  openline dev ping customer-os')
        this.log('🦦 Visit http://localhost:10000 in your browser to play around with the graph API explorer')
        shell.exec('open http://localhost:10000')

        if (args.app.toLowerCase() === 'contacts') {
          this.log('')
          this.log('🦦 installing Contacts app...')
          let contactsApp = contacts.installContacts(flags.verbose, flags.tag)

          if (contactsApp) {
            this.log('✅ Contacts app started successfully!')
            this.log('🦦 To validate the service is reachable run the command =>  openline dev ping contacts')
            this.log('🦦 Visit http://localhost:3000 in your browser to view the application')
            shell.exec('open http://localhost:3000')
          }
        }
      }

    }
  }
}

