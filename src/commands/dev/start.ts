import {Command, Flags} from '@oclif/core'
import * as colima from '../../lib/dev/colima'
import * as mac from '../../lib/mac-dependency-check'
import * as ns from '../../lib/dev/namespace'
import * as neo from '../../lib/dev/neo4j'
import * as sql from '../../lib/dev/postgres'
import * as fusionauth from '../../lib/dev/auth'
import * as shell from 'shelljs'
import {getConfig} from '../../config/dev'
import {installCustomerOsApi, installMessageStoreApi} from '../../lib/dev/customer-os'
import {installContactsGui} from '../../lib/dev/contacts'
import * as oasis from '../../lib/dev/oasis'

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
      options: [
        'customer-os',
        'contacts',
        'oasis',
        'auth',
        'customer-os-api',
        'message-store-api',
        'oasis-api',
        'channels-api',
        'oasis-gui',
        'contacts-gui',
      ],
    },
  ]

  public async run(): Promise<void> {
    const {flags, args} = await this.parse(DevStart)
    const config = getConfig()
    let location = flags.location
    let cleanup = false

    if (!location) {
      shell.exec(`git clone ${config.customerOs.repo} ${config.setupDir}`)
      location = config.setupDir
      cleanup = true
    }

    // start core services
    console.log('🦦 initiating Openline dev server...')
    startup(flags.verbose, location)
    console.log('🦦 setting up core infrastructure...')
    startCoreServices(flags.verbose, location)

    // start customerOS
    if (args.app === 'customer-os' || args.app === 'contacts' || args.app === 'oasis') {
      console.log(`🦦 starting customerOS version <${flags.tag}>...`)
      console.log('this can take a few mins...')
      startCustomerOs(flags.verbose, location, flags.tag, cleanup)
    }

    // start contacts app
    if (args.app === 'contacts' || args.app === 'contacts-gui') {
      console.log(`🦦 starting Contacts app version <${flags.tag}>...`)
      let contactsCleanup = false
      if (!flags.location) {
        shell.exec(`git clone ${config.contacts.repo} ${config.setupDir}`)
        location = config.setupDir
        contactsCleanup = true
      }

      startContacts(flags.verbose, location, flags.tag)

      if (contactsCleanup) {
        shell.exec(`rm -r ${config.setupDir}`)
      }
    }

    // start oasis app
    if (args.app === 'oasis') {
      console.log(`🦦 starting Oasis app version <${flags.tag}>...`)
      let oasisCleanup = false
      if (!flags.location) {
        shell.exec(`git clone ${config.oasis.repo} ${config.setupDir}`)
        location = config.setupDir
        oasisCleanup = true
      }

      startChannelsApi(flags.verbose, location, flags.tag)
      startOasisApi(flags.verbose, location, flags.tag)
      startOasisGui(flags.verbose, location, flags.tag)

      if (oasisCleanup) {
        shell.exec(`rm -r ${config.setupDir}`)
      }
    }

    this.log('🦦 Congrats!')
  }
}

function startup(verbose: boolean, location: string | undefined) :boolean {
  // Base dependency check
  const depend = mac.installDependencies(verbose)
  if (!depend) {
    process.exit(1) // eslint-disable-line no-process-exit, unicorn/no-process-exit
  }

  // Start colima with Openline dev server config
  const isRunning = colima.runningCheck()
  if (!isRunning) {
    const start = colima.startColima(verbose)
    if (!start) process.exit(1) // eslint-disable-line no-process-exit, unicorn/no-process-exit
  }

  // Create namespace in k8s
  if (verbose) console.log('⏳ installing namespace')
  const namespace = ns.installNamespace(verbose, location)
  if (!namespace) process.exit(1) // eslint-disable-line no-process-exit, unicorn/no-process-exit

  return true
}

function startCoreServices(verbose: boolean, location: string | undefined) :boolean {
  // Install databases
  if (verbose) console.log('⏳ starting Neo4j')
  const neo4j = neo.installNeo4j(verbose, location)
  if (!neo4j) process.exit(1) // eslint-disable-line no-process-exit, unicorn/no-process-exit

  if (verbose) console.log('⏳ starting postgreSQL')
  const postgresql = sql.installPostgresql(verbose, location)
  if (!postgresql) process.exit(1) // eslint-disable-line no-process-exit, unicorn/no-process-exit

  // Install authentication
  if (verbose) console.log('⏳ installing fusionauth')
  const auth = fusionauth.installFusionAuth(verbose, location)
  if (!auth) process.exit(1) // eslint-disable-line no-process-exit, unicorn/no-process-exit

  return true
}

function startCustomerOs(verbose: boolean, location: string | undefined, imageVersion: string, cleanup: boolean) :boolean {
  const config = getConfig()
  if (verbose) console.log('⏳ installing customerOS API')
  const api = installCustomerOsApi(verbose, location, imageVersion)
  if (!api) process.exit(1) // eslint-disable-line no-process-exit, unicorn/no-process-exit

  if (verbose) console.log('⏳ installing message store API')
  const msapi = installMessageStoreApi(verbose, location, imageVersion)
  if (!msapi) process.exit(1) // eslint-disable-line no-process-exit, unicorn/no-process-exit

  // Provision databases
  if (verbose) console.log('⏳ configuring postgreSQL')
  const sqlConfig = sql.provisionPostgresql(verbose, location)
  if (!sqlConfig) process.exit(1) // eslint-disable-line no-process-exit, unicorn/no-process-exit

  if (verbose) console.log('⏳ configuring Neo4j...this can take up to 10 mins')
  const neoConfig = neo.provisionNeo4j(verbose, location)
  if (!neoConfig) process.exit(1) // eslint-disable-line no-process-exit, unicorn/no-process-exit

  if (cleanup) {
    shell.exec(`rm -r ${config.setupDir}`)
  }

  return true
}

function startContacts(verbose: boolean, location: string | undefined, imageVersion: string) :boolean {
  if (verbose) console.log('⏳ installing Contacts GUI')
  const gui = installContactsGui(verbose, location, imageVersion)
  if (!gui) process.exit(1) // eslint-disable-line no-process-exit, unicorn/no-process-exit
  return true
}

function startChannelsApi(verbose: boolean, location: string | undefined, imageVersion: string) :boolean {
  if (verbose) console.log('⏳ installing channels API')
  const api = oasis.installChannelsApi(verbose, location, imageVersion)
  if (!api) process.exit(1) // eslint-disable-line no-process-exit, unicorn/no-process-exit
  return true
}

function startOasisApi(verbose: boolean, location: string | undefined, imageVersion: string) :boolean {
  if (verbose) console.log('⏳ installing Oasis API')
  const api = oasis.installOasisApi(verbose, location, imageVersion)
  if (!api) process.exit(1) // eslint-disable-line no-process-exit, unicorn/no-process-exit
  return true
}

function startOasisGui(verbose: boolean, location: string | undefined, imageVersion: string) :boolean {
  if (verbose) console.log('⏳ installing Oasis GUI')
  const api = oasis.installOasisGui(verbose, location, imageVersion)
  if (!api) process.exit(1) // eslint-disable-line no-process-exit, unicorn/no-process-exit
  return true
}

