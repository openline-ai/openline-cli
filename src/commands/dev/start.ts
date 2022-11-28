import {Command, Flags} from '@oclif/core'
import * as shell from 'shelljs'
import * as dev from '../../lib/dev/start-colima'
import * as install from '../../lib/dev/install-tag-customer-os'
import * as mac from '../../lib/mac-dependency-check'
import * as contacts from '../../lib/dev/install-tag-contacts'
import {installOasis} from '../../lib/dev/install-tag-oasis'
import {installLocalCustomerOs} from '../../lib/dev/install-local-customer-os'

export default class DevStart extends Command {
  static description = 'Start an Openline development server'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    all: Flags.boolean({char: 'a', description: 'start all Openline apps & services'}),
    tag: Flags.string({
      char: 't',
      description: 'version tag of the image you would like to deploy',
      default: 'latest',
    }),
    location: Flags.string({
      char: 'l',
      description: 'location for the source code to be used in the installation',
    }),
    verbose: Flags.boolean({char: 'v'}),
  }

  static args = [
    {
      name: 'app',
      required: false,
      description: 'the Openline application you would like to start',
      default: 'customer-os',
      options: ['customer-os', 'contacts', 'oasis'],
    },
  ]

  public async run(): Promise<void> {
    const {flags, args} = await this.parse(DevStart)

    // Base dependency check
    const depend = mac.installDependencies(flags.verbose)
    if (!depend) {
      this.exit(1)
    }

    this.log('🦦 initiating Openline dev server...')
    const start = dev.startColima(flags.verbose)
    if (!start) {
      this.exit(1)
    }

    this.log('🦦 installing customerOS...')
    const customerOsInstalled = flags.location ? installLocalCustomerOs(flags.location, flags.verbose) : install.installTaggedCustomerOs(flags.verbose, flags.tag)

    if (customerOsInstalled) {
      this.log('')
      this.log('✅ customerOS started successfully!')
      this.log('🦦 To validate the service is reachable run the command =>  openline dev ping customer-os')
      this.log('🦦 Visit http://localhost:10000 in your browser to play around with the graph API explorer')
      shell.exec('open http://localhost:10000')
    } else {
      this.exit(1)
    }

    if (flags.all) {
      startContacts(flags.verbose, flags.tag)
      startOasis(flags.verbose, flags.tag)
    }

    if (args.app.toLowerCase() === 'contacts') {
      startContacts(flags.verbose, flags.tag)
    }

    if (args.app.toLowerCase() === 'oasis') {
      startOasis(flags.verbose, flags.tag)
    }
  }
}

function startContacts(verbose :boolean, tag :string) :boolean {
  console.log('')
  console.log('🦦 installing Contacts app...')
  const result = contacts.installContacts(verbose, tag)

  if (result) {
    console.log('✅ Contacts app started successfully!')
    console.log('🦦 To validate the service is reachable run the command =>  openline dev ping contacts')
    console.log('🦦 Visit http://localhost:3000 in your browser to view the application')
    shell.exec('open http://localhost:3000')
  }

  return result
}

function startOasis(verbose :boolean, tag :string) :boolean {
  console.log('')
  console.log('🦦 installing Oasis app...')
  const result = installOasis(verbose, tag)

  if (result) {
    console.log('✅ Oasis app started successfully!')
    console.log('🦦 To validate the service is reachable run the command =>  openline dev ping oasis')
    console.log('🦦 Visit http://localhost:3006 in your browser to view the application')
    shell.exec('sleep 5')
    shell.exec('open http://localhost:3006')
  }

  return result
}
