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
    let cleanup = false

    if (!flags.location) {
      // Clone customer-os repo
      shell.exec(`git clone ${config.customerOs.repo} ${config.setupDir}`)
      flags.location = config.setupDir
      cleanup = true
    }

    console.log('🦦 initiating Openline dev server...')
    startup(flags.verbose, flags.location)
    console.log('🦦 setting up core infrastructure...')
    startCoreServices(flags.verbose, flags.location)

    if (args.app === 'customer-os' || args.app === 'contacts' || args.app === 'oasis') {
      console.log(`🦦 starting customerOS version <${flags.tag}>...`)
      console.log('this can take a few mins...')
      startCustomerOs(flags.verbose, flags.location, flags.tag, cleanup)
    }

    if (args.app === 'contacts' || args.app === 'contacts-gui') {
      console.log(`🦦 starting Contacts app version <${flags.tag}>...`)
      startContacts(flags.verbose, flags.location, flags.tag)
    }

    if (args.app === 'oasis') {

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
  const config = getConfig()
  let cleanup = false
  if (location === null) {
    // Clone contacts repo
    shell.exec(`git clone ${config.contacts.repo} ${config.setupDir}`)
    location = config.setupDir
    cleanup = true
  }

  if (verbose) console.log('⏳ installing Contacts GUI')
  const gui = installContactsGui(verbose, location, imageVersion)
  if (!gui) process.exit(1) // eslint-disable-line no-process-exit, unicorn/no-process-exit

  if (cleanup) {
    shell.exec(`rm -r ${config.setupDir}`)
  }

  return true
}
