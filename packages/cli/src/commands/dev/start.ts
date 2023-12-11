/* eslint-disable complexity */
import {Command, Flags} from '@oclif/core'
import * as ns from '../../lib/dev/namespace'
import * as neo from '../../lib/dev/neo4j'
import * as sql from '../../lib/dev/postgres'
import * as redis from '../../lib/dev/redis'
import {getConfig} from '../../config/dev'
import {
  installCustomerOsApi,
  installfileStoreApi,
  installSettingsApi,
  installCommsApi,
  installEventsProcessingPlatform,
  installValidationApi,
  installUserAdminApi,
  installWebhooks
} from '../../lib/dev/customer-os'
import {installEventStoreDB} from '../../lib/dev/eventstore'
import * as start from '../../lib/dev/start'
import {logTerminal} from '../../lib/logs'
import {installJaeger} from "../../lib/dev/jaeger";

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
        'comms-api',
        'customer-os',
        'customer-os-api',
        'customer-os-webhooks',
        'db',
        'events-processing-platform',
        'event-store-db',
        'file-store-api',
        'jaeger',
        'settings-api',
        'test-env',
        `user-admin-api`,
        'validation-api',
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
      start.cleanupSetupFiles()
      // install customerOS
      ns.installNamespace(flags.verbose, location)
      start.installDatabases(flags.verbose, location)
      installCustomerOsApi(flags.verbose, location, version)
      installfileStoreApi(flags.verbose, location, version)
      installSettingsApi(flags.verbose, location, version)
      installCommsApi(flags.verbose, location, version)
      installEventStoreDB(flags.verbose, location)
      installEventsProcessingPlatform(flags.verbose, location, version)
      installValidationApi(flags.verbose, location, version)
      installUserAdminApi(flags.verbose, location, version)
      installWebhooks(flags.verbose, location, version)
      installJaeger(flags.verbose, location, version)
      sql.provisionPostgresql(flags.verbose, location)
      neo.provisionNeo4j(flags.verbose, location)
      neo.provisionNeo4jWithDemoTenant(flags.verbose)
      redis.provisionRedis(flags.verbose, location)
      start.cleanupSetupFiles()
      start.cleanupSetupFiles()

      logTerminal('SUCCESS', 'Openline dev server has been started')
      logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
      this.exit(0)
    }

    const app = args.app.toLowerCase()
    switch (app) {
    case 'customer-os':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      start.cleanupSetupFiles()
      // install customerOS
      ns.installNamespace(flags.verbose, location)
      start.installDatabases(flags.verbose, location)
      installCustomerOsApi(flags.verbose, location, version)
      installfileStoreApi(flags.verbose, location, version)
      installSettingsApi(flags.verbose, location, version)
      installCommsApi(flags.verbose, location, version)
      installEventStoreDB(flags.verbose, location)
      installEventsProcessingPlatform(flags.verbose, location, version)
      installValidationApi(flags.verbose, location, version)
      installUserAdminApi(flags.verbose, location, version)
      installWebhooks(flags.verbose, location, version)
      installJaeger(flags.verbose, location, version)
      sql.provisionPostgresql(flags.verbose, location)
      neo.provisionNeo4j(flags.verbose, location)
      neo.provisionNeo4jWithDemoTenant(flags.verbose)
      redis.provisionRedis(flags.verbose, location)
      start.cleanupSetupFiles()
      logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
      break

    case 'customer-os-api':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      start.cleanupSetupFiles()
      // install customerOS
      ns.installNamespace(flags.verbose, location)
      installCustomerOsApi(flags.verbose, location, version)
      logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
      break

    case 'settings-api':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      start.cleanupSetupFiles()
      // install customerOS
      ns.installNamespace(flags.verbose, location)
      installSettingsApi(flags.verbose, location, version)
      logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
      break

    case 'file-store-api':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      start.cleanupSetupFiles()
      // install customerOS
      ns.installNamespace(flags.verbose, location)
      installfileStoreApi(flags.verbose, location, version)
      logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
      break
    case 'comms-api':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      start.cleanupSetupFiles()
      ns.installNamespace(flags.verbose, location)
      installCommsApi(flags.verbose, location, version)
      start.cleanupSetupFiles()
      logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
      break

    case 'db':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      start.cleanupSetupFiles()
      // install customerOS
      ns.installNamespace(flags.verbose, location)
      start.installDatabases(flags.verbose, location)
      sql.provisionPostgresql(flags.verbose, location)
      neo.provisionNeo4j(flags.verbose, location)
      neo.provisionNeo4jWithDemoTenant(flags.verbose)
      redis.provisionRedis(flags.verbose, location)
      start.cleanupSetupFiles()
      logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
      break

    case 'event-store-db':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      start.cleanupSetupFiles()
      // install customerOS
      ns.installNamespace(flags.verbose, location)
      installEventStoreDB(flags.verbose, location)
      start.cleanupSetupFiles()
      logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
      break

    case 'events-processing-platform':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      start.cleanupSetupFiles()
      // install customerOS
      ns.installNamespace(flags.verbose, location)
      installEventsProcessingPlatform(flags.verbose, location)
      start.cleanupSetupFiles()
      logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
      break

    case 'jaeger':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      start.cleanupSetupFiles()
      // install customerOS
      ns.installNamespace(flags.verbose, location)
      installJaeger(flags.verbose, location)
      start.cleanupSetupFiles()
      logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
      break

      case 'validation-api':
        start.dependencyCheck(flags.verbose)
        start.startDevServer(flags.verbose)
        start.cleanupSetupFiles()
        // install customerOS
        ns.installNamespace(flags.verbose, location)
        installValidationApi(flags.verbose, location, version)
        logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
        break

      case 'user-admin-api':
        start.dependencyCheck(flags.verbose)
        start.startDevServer(flags.verbose)
        start.cleanupSetupFiles()
        // install customerOS
        ns.installNamespace(flags.verbose, location)
        installUserAdminApi(flags.verbose, location, version)
        logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
        break

      case 'customer-os-webhooks':
        start.dependencyCheck(flags.verbose)
        start.startDevServer(flags.verbose)
        start.cleanupSetupFiles()
        // install customerOS
        ns.installNamespace(flags.verbose, location)
        installWebhooks(flags.verbose, location, version)
        logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
        break

      case 'test-env':
        start.dependencyCheck(flags.verbose)
        start.startDevServer(flags.verbose)
        start.cleanupSetupFiles()
        ns.installNamespace(flags.verbose, location)
        start.installDatabases(flags.verbose, location)
        installCustomerOsApi(flags.verbose, location, version)
        installEventStoreDB(flags.verbose, location)
        installEventsProcessingPlatform(flags.verbose, location, version)
        installUserAdminApi(flags.verbose, location, version)
        sql.provisionPostgresql(flags.verbose, location)
        neo.provisionNeo4j(flags.verbose, location)
        neo.provisionNeo4jWithDemoTenant(flags.verbose)
        redis.provisionRedis(flags.verbose, location)
        start.cleanupSetupFiles()
        logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
        break
    }
  }
}
