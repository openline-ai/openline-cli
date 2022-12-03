/* eslint-disable  complexity */
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
import * as start from '../../lib/dev/start'
import { cloneRepo } from '../../lib/clone/clone-repo'

export default class DevStart extends Command {
  static description = 'Start an Openline development server'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    all: Flags.boolean({description: 'start all Openline apps & services'}),
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
    test: Flags.boolean({hidden: true}),
  }

  static args = [
    {
      name: 'app',
      required: false,
      description: 'the Openline application you would like to start',
      default: 'customer-os',
      options: [
        'auth',
        'channels-api',
        'contacts',
        'contacts-gui',
        'customer-os',
        'customer-os-api',
        'db',
        'oasis',
        'oasis-api',
        'oasis-gui',
        'message-store-api',
      ],
    },
  ]

  public async run(): Promise<void> {
    const {flags, args} = await this.parse(DevStart)
    const config = getConfig()
    let location = flags.location
    let version = flags.tag
    let cleanup = false

    if (flags.test) {
      this.exit(0)
    }

    // cleanup any old setup files
    start.cleanupSetupFiles()

    // if building from local files, set version to <local>
    if (location) {
      version = 'local'
      if (location[0] !== '/') location = '/' + location

    if (flags.all) {
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir)
      ns.installNamespace(flags.verbose, location)
      start.installDatabases(flags.verbose, location)
      this.exit(0)
    }

    const app = args.app.toLowerCase()
    switch (app) {
    case 'auth':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir)
      break

    case 'channels-api':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      break

    case 'contacts':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir)
      break

    case 'contacts-gui':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      break

    case 'customer-os':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir)
      break

    case 'customer-os-api':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir)
      break

    case 'db':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir)
      break

    case 'oasis':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir)
      break

    case 'oasis-api':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      break

    case 'oasis-gui':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      break

    case 'message-store-api':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir)
      break
    }
  }
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

  if (cleanup) shell.exec(`rm -r ${config.setupDir}`, {silent: !verbose})

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

function startEverything(verbose: boolean, location: string | undefined, imageVersion: string) :boolean {
  const config = getConfig()
  let cleanup = false
  if (!startup(verbose)) return false
  if (location === undefined) {
    shell.exec(`git clone ${config.customerOs.repo} ${config.setupDir} --quiet`)
    location = config.setupDir
    cleanup = true
  } else {
    imageVersion = 'local'
    if (location[0] !== '/') location = '/' + location
  }

  // start core services
  console.log('🦦 setting up core infrastructure...')
  if (!startCoreServices(verbose, location)) return false

  // start customerOS
  console.log(`🦦 starting customerOS version <${imageVersion}>...`)
  console.log('⏳ this can take a few mins...')
  if (!startCustomerOs(verbose, location, imageVersion, cleanup)) return false

  // start contacts app
  console.log(`🦦 starting Contacts app version <${imageVersion}>...`)
  let contactsCleanup = false
  if (location === config.setupDir) {
    shell.exec(`git clone ${config.contacts.repo} ${config.setupDir} --quiet`)
    location = config.setupDir
    contactsCleanup = true
  }

  if (!startContacts(verbose, location, imageVersion)) return false

  if (contactsCleanup) {
    shell.exec(`rm -r ${config.setupDir}`, {silent: !verbose})
  }

  // start oasis app
  let oasisCleanup = false
  if (location === config.setupDir) {
    shell.exec(`git clone ${config.oasis.repo} ${config.setupDir} --quiet`)
    location = config.setupDir
    oasisCleanup = true
  }

  console.log(`🦦 starting Oasis app version <${imageVersion}>...`)
  if (!startChannelsApi(verbose, location, imageVersion)) return false
  if (!startOasisApi(verbose, location, imageVersion)) return false
  if (!startOasisGui(verbose, location, imageVersion)) return false

  if (oasisCleanup) {
    shell.exec(`rm -r ${config.setupDir}`, {silent: !verbose})
  }

  return true
}
