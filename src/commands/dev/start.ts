import {Command, Flags} from '@oclif/core'
import * as ns from '../../lib/dev/namespace'
import * as neo from '../../lib/dev/neo4j'
import * as sql from '../../lib/dev/postgres'
import * as fusionauth from '../../lib/dev/auth'
import {getConfig} from '../../config/dev'
import {installCustomerOsApi, installMessageStoreApi} from '../../lib/dev/customer-os'
import {installContactsGui} from '../../lib/dev/contacts'
import * as oasis from '../../lib/dev/oasis'
import * as start from '../../lib/dev/start'
import {cloneRepo} from '../../lib/clone/clone-repo'
import {logTerminal} from '../../lib/logs'

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

    if (flags.test) {
      this.exit(0)
    }

    // cleanup any old setup files
    start.cleanupSetupFiles()

    // if building from local files, set version to <local>
    if (location) {
      version = 'local'
      if (location[0] !== '/') location = '/' + location
    }

    if (flags.all) {
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      // install customerOS
      cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true)
      ns.installNamespace(flags.verbose, location)
      start.installDatabases(flags.verbose, location)
      fusionauth.installFusionAuth(flags.verbose, location)
      installCustomerOsApi(flags.verbose, location, version)
      installMessageStoreApi(flags.verbose, location, version)
      sql.provisionPostgresql(flags.verbose, location)
      neo.provisionNeo4j(flags.verbose, location)
      start.cleanupSetupFiles()
      // install contacts
      cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true)
      installContactsGui(flags.verbose, location, version)
      start.cleanupSetupFiles()
      // install oasis
      cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true)
      oasis.installChannelsApi(flags.verbose, location, version)
      oasis.installOasisApi(flags.verbose, location, version)
      oasis.installOasisGui(flags.verbose, location, version)
      start.cleanupSetupFiles()

      logTerminal('SUCCESS', 'Openline dev server has been started')
      logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
      this.exit(0)
    }

    const app = args.app.toLowerCase()
    switch (app) {
    case 'auth':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir)
      ns.installNamespace(flags.verbose, location)
      fusionauth.installFusionAuth(flags.verbose, location)
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
