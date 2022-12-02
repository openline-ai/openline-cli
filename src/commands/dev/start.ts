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
        'customer-os',
        'contacts',
        'oasis',
        'auth',
        'db',
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
    let version = flags.tag
    let cleanup = false

    if (flags.test) {
      fusionauth.addHosts(true)
      this.exit(1)
    }

    if (flags.all) {
      if (!startEverything(flags.verbose, location, version)) this.exit(1)
      this.log('✅ success!')
    } else {
      startup(flags.verbose)

      // apps & services that require customer-os
      const customerOs = ['customer-os', 'contacts', 'oasis', 'auth', 'db', 'customer-os-api', 'message-store-api']
      if (customerOs.includes(args.app.toLowerCase())) {
        if (location) {
          version = 'local'
          if (location[0] !== '/') location = '/' + location
        } else {
          shell.exec(`git clone ${config.customerOs.repo} ${config.setupDir} --quiet`)
          location = config.setupDir
          cleanup = true
        }

        // apps & services that require all core services (databases & auth)
        const coreServices = ['customer-os', 'contacts', 'oasis', 'auth', 'db']
        if (coreServices.includes(args.app.toLowerCase())) {
          // start core services
          console.log('🦦 setting up core infrastructure...')
          startCoreServices(flags.verbose, location)
        }

        // apps that require full customerOS install
        const fullCustomerOs = ['customer-os', 'contacts', 'oasis']
        if (fullCustomerOs.includes(args.app.toLowerCase())) {
          console.log(`🦦 starting customerOS version <${version}>...`)
          console.log('⏳ this can take a few mins...')
          startCustomerOs(flags.verbose, location, version, cleanup)
        }

        // start db only
        if (args.app.toLowerCase() === 'db') {
          console.log(`🦦 starting databases version <${version}>...`)
          // Provision databases
          if (flags.verbose) console.log('⏳ configuring postgreSQL')
          const sqlConfig = sql.provisionPostgresql(flags.verbose, location)
          if (!sqlConfig) process.exit(1) // eslint-disable-line no-process-exit, unicorn/no-process-exit

          if (flags.verbose) console.log('⏳ configuring Neo4j...this can take up to 10 mins')
          const neoConfig = neo.provisionNeo4j(flags.verbose, location)
          if (!neoConfig) process.exit(1) // eslint-disable-line no-process-exit, unicorn/no-process-exit
        }

        // start authentication only
        if (args.app.toLowerCase() === 'auth') {
          console.log(`🦦 starting authentication version <${version}>...`)
          const auth = fusionauth.installFusionAuth(flags.verbose, location)
          if (!auth) process.exit(1) // eslint-disable-line no-process-exit, unicorn/no-process-exit
        }

        // start customer-os-api only
        if (args.app.toLowerCase() === 'customer-os-api') {
          console.log(`🦦 starting customer-os-api version <${version}>...`)
          const api = installCustomerOsApi(flags.verbose, location, version)
          if (!api) process.exit(1) // eslint-disable-line no-process-exit, unicorn/no-process-exit
        }

        // start message-store api only
        if (args.app.toLowerCase() === 'message-store-api') {
          console.log(`🦦 starting message-store-api version <${version}>...`)
          const msapi = installMessageStoreApi(flags.verbose, location, version)
          if (!msapi) process.exit(1) // eslint-disable-line no-process-exit, unicorn/no-process-exit
        }

        if (cleanup) shell.exec(`rm -r ${config.setupDir}`)
      }

      // start contacts app
      if (args.app.toLowerCase() === 'contacts' || args.app === 'contacts-gui') {
        console.log(`🦦 starting Contacts app version <${version}>...`)
        let contactsCleanup = false
        if (!flags.location) {
          shell.exec(`git clone ${config.contacts.repo} ${config.setupDir} --quiet`)
          location = config.setupDir
          contactsCleanup = true
        }

        startContacts(flags.verbose, location, version)

        if (contactsCleanup) shell.exec(`rm -r ${config.setupDir}`)
      }

      // start oasis app
      const oasis = ['oasis', 'oasis-api', 'oasis-gui', 'contacts-api']
      if (oasis.includes(args.app.toLowerCase())) {
        let oasisCleanup = false
        if (!flags.location) {
          shell.exec(`git clone ${config.oasis.repo} ${config.setupDir} --quiet`)
          location = config.setupDir
          oasisCleanup = true
        }

        if (args.app.toLowerCase() === 'oasis') {
          console.log(`🦦 starting Oasis app version <${version}>...`)
          startChannelsApi(flags.verbose, location, version)
          startOasisApi(flags.verbose, location, version)
          startOasisGui(flags.verbose, location, version)
        }

        if (args.app.toLowerCase() === 'oasis-api') {
          console.log(`🦦 starting oasis-api version <${version}>...`)
          startOasisApi(flags.verbose, location, version)
        }

        if (args.app.toLowerCase() === 'oasis-gui') {
          console.log(`🦦 starting oasis-gui version <${version}>...`)
          startOasisGui(flags.verbose, location, version)
        }

        if (args.app.toLowerCase() === 'channels-api') {
          console.log(`🦦 starting channels-api version <${version}>...`)
          startChannelsApi(flags.verbose, location, version)
        }

        if (oasisCleanup) shell.exec(`rm -r ${config.setupDir}`)
      }

      this.log('✅ success!')
    }
  }
}

function startup(verbose: boolean) :boolean {
  // Base dependency check
  const depend = mac.installDependencies(verbose)
  if (!depend) {
    process.exit(1) // eslint-disable-line no-process-exit, unicorn/no-process-exit
  }

  // Start colima with Openline dev server config
  console.log('🦦 initiating Openline dev server...')
  const isRunning = colima.runningCheck()
  if (!isRunning) {
    const start = colima.startColima(verbose)
    if (!start) process.exit(1) // eslint-disable-line no-process-exit, unicorn/no-process-exit
  }

  // set permissions on kube config
  const updatePermissions = 'chmod og-r ~/.kube/config'
  if (verbose) console.log(`[EXEC] ${updatePermissions}`)
  shell.exec(updatePermissions, {silent: true})

  // explicitly set context to colima
  const setContext = 'kubectl config use-context colima'
  if (verbose) console.log(`[EXEC] ${setContext}`)
  const update = shell.exec(updatePermissions, {silent: true})
  if (!update) process.exit(1) // eslint-disable-line no-process-exit, unicorn/no-process-exit

  return true
}

function startCoreServices(verbose: boolean, location: string | undefined) :boolean {
  // Create namespace in k8s
  if (verbose) console.log('⏳ installing namespace')
  const namespace = ns.installNamespace(verbose, location)
  if (!namespace) process.exit(1) // eslint-disable-line no-process-exit, unicorn/no-process-exit

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

  if (cleanup) shell.exec(`rm -r ${config.setupDir}`)

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
    shell.exec(`rm -r ${config.setupDir}`)
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
    shell.exec(`rm -r ${config.setupDir}`)
  }

  return true
}
