/* eslint-disable complexity */
import {Command, Flags} from '@oclif/core'
import * as ns from '../../lib/dev/namespace'
import * as neo from '../../lib/dev/neo4j'
import * as sql from '../../lib/dev/postgres'
import {getConfig} from '../../config/dev'
import {installCustomerOsApi, installfileStoreApi, installOryTunnel, installSettingsApi, installCommsApi, installEventsProcessingPlatform} from '../../lib/dev/customer-os'
import {installContactsGui} from '../../lib/dev/contacts'
import {installEventStoreDB} from '../../lib/dev/eventstore'
import * as voice from '../../lib/dev/voice'
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
        'asterisk',
        'channels-api',
        'comms-api',
        'contacts',
        'contacts-gui',
        'customer-os',
        'customer-os-api',
        'db',
        'kamailio',
        'file-store-api',
        'settings-api',
        'voice',
        'voice-plugin',
        'ory-tunnel',
        'event-store-db',
        'events-processing-platform'
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
      cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true)
      ns.installNamespace(flags.verbose, location)
      start.installDatabases(flags.verbose, location)
      installCustomerOsApi(flags.verbose, location, version)
      installfileStoreApi(flags.verbose, location, version)
      installSettingsApi(flags.verbose, location, version)
      installOryTunnel(flags.verbose, location, version)
      installCommsApi(flags.verbose, location, version)
      installEventsProcessingPlatform(flags.verbose, location, version)
      sql.provisionPostgresql(flags.verbose, location)
      neo.provisionNeo4j(flags.verbose, location)
      start.cleanupSetupFiles()
      // install contacts
      cloneRepo(config.contacts.repo, flags.verbose, config.setupDir, undefined, true)
      installContactsGui(flags.verbose, location, version)
      start.cleanupSetupFiles()

      logTerminal('SUCCESS', 'Openline dev server has been started')
      logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
      this.exit(0)
    }

    const app = args.app.toLowerCase()
    switch (app) {
    case 'contacts':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      start.cleanupSetupFiles()
      // install customerOS
      cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true)
      ns.installNamespace(flags.verbose, location)
      start.installDatabases(flags.verbose, location)
      installCustomerOsApi(flags.verbose, location, version)
      installfileStoreApi(flags.verbose, location, version)
      installSettingsApi(flags.verbose, location, version)
      sql.provisionPostgresql(flags.verbose, location)
      neo.provisionNeo4j(flags.verbose, location)
      start.cleanupSetupFiles()
      // install contacts
      cloneRepo(config.contacts.repo, flags.verbose, config.setupDir, undefined, true)
      installContactsGui(flags.verbose, location, version)
      start.cleanupSetupFiles()
      logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
      break

    case 'contacts-gui':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      start.cleanupSetupFiles()
      cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true)
      ns.installNamespace(flags.verbose, location)
      start.cleanupSetupFiles()
      cloneRepo(config.contacts.repo, flags.verbose, config.setupDir, undefined, true)
      installContactsGui(flags.verbose, location, version)
      start.cleanupSetupFiles()
      logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
      break

    case 'customer-os':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      start.cleanupSetupFiles()
      // install customerOS
      cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true)
      ns.installNamespace(flags.verbose, location)
      start.installDatabases(flags.verbose, location)
      installEventStoreDB(flags.verbose, location)
      installCustomerOsApi(flags.verbose, location, version)
      installfileStoreApi(flags.verbose, location, version)
      installSettingsApi(flags.verbose, location, version)
      installCommsApi(flags.verbose, location, version)
      installEventsProcessingPlatform(flags.verbose, location, version)
      sql.provisionPostgresql(flags.verbose, location)
      neo.provisionNeo4j(flags.verbose, location)
      start.cleanupSetupFiles()
      logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
      break

    case 'customer-os-api':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      start.cleanupSetupFiles()
      // install customerOS
      cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true)
      ns.installNamespace(flags.verbose, location)
      installCustomerOsApi(flags.verbose, location, version)
      logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
      break

    case 'settings-api':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      start.cleanupSetupFiles()
      // install customerOS
      cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true)
      ns.installNamespace(flags.verbose, location)
      installSettingsApi(flags.verbose, location, version)
      logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
      break

    case 'ory-tunnel':
        start.dependencyCheck(flags.verbose)
        start.startDevServer(flags.verbose)
        start.cleanupSetupFiles()
        // install customerOS
        cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true)
        ns.installNamespace(flags.verbose, location)
        installOryTunnel(flags.verbose, location, version)
        logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
        break

    case 'file-store-api':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      start.cleanupSetupFiles()
      // install customerOS
      cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true)
      ns.installNamespace(flags.verbose, location)
      installfileStoreApi(flags.verbose, location, version)
      logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
      break

    case 'comms-api':
      start.dependencyCheck(flags.verbose)
      start.startDevServer(flags.verbose)
      start.cleanupSetupFiles()
      cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true)
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
      cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true)
      ns.installNamespace(flags.verbose, location)
      start.installDatabases(flags.verbose, location)
      sql.provisionPostgresql(flags.verbose, location)
      neo.provisionNeo4j(flags.verbose, location)
      start.cleanupSetupFiles()
      logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
      break

    case 'voice':
      start.dependencyCheck(flags.verbose)
      if (process.arch !== 'x64') {
        logTerminal('ERROR', 'Voice Platform only works on x86 machines, detected: ' + process.arch)
        return
      }

      start.startDevServer(flags.verbose)
      start.cleanupSetupFiles()
      // install customerOS
      cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true)
      ns.installNamespace(flags.verbose, location)
      start.installDatabases(flags.verbose, location)
      installCustomerOsApi(flags.verbose, location, version)
      installfileStoreApi(flags.verbose, location, version)
      installSettingsApi(flags.verbose, location, version)
      installCommsApi(flags.verbose, location, version)
      sql.provisionPostgresql(flags.verbose, location)
      neo.provisionNeo4j(flags.verbose, location)
      start.cleanupSetupFiles()
      // install voice
      cloneRepo(config.voice.repo, flags.verbose, config.setupDir, undefined, true)
      voice.installKamailio(flags.verbose, location, version)
      voice.installAsterisk(flags.verbose, location, version)
      voice.installVoicePlugin(flags.verbose, location, version)
      start.cleanupSetupFiles()
      logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
      break

    case 'kamailio':
      start.dependencyCheck(flags.verbose)
      if (process.arch !== 'x64') {
        logTerminal('ERROR', 'Voice Platform only works on x86 machines, detected: ' + process.arch)
        return
      }

      start.startDevServer(flags.verbose)
      start.cleanupSetupFiles()
      cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true)
      ns.installNamespace(flags.verbose, location)
      start.cleanupSetupFiles()
      cloneRepo(config.voice.repo, flags.verbose, config.setupDir, undefined, true)
      voice.installKamailio(flags.verbose, location, version)
      start.cleanupSetupFiles()
      logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
      break

    case 'asterisk':
      start.dependencyCheck(flags.verbose)
      if (process.arch !== 'x64') {
        logTerminal('ERROR', 'Voice Platform only works on x86 machines, detected: ' + process.arch)
        return
      }

      start.startDevServer(flags.verbose)
      start.cleanupSetupFiles()
      cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true)
      ns.installNamespace(flags.verbose, location)
      start.cleanupSetupFiles()
      cloneRepo(config.voice.repo, flags.verbose, config.setupDir, undefined, true)
      voice.installAsterisk(flags.verbose, location, version)
      start.cleanupSetupFiles()
      logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
      break

    case 'voice-plugin':
      start.dependencyCheck(flags.verbose)
      if (process.arch !== 'x64') {
        logTerminal('ERROR', 'Voice Platform only works on x86 machines, detected: ' + process.arch)
        return
      }

      start.startDevServer(flags.verbose)
      start.cleanupSetupFiles()
      cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true)
      ns.installNamespace(flags.verbose, location)
      start.cleanupSetupFiles()
      cloneRepo(config.voice.repo, flags.verbose, config.setupDir, undefined, true)
      voice.installVoicePlugin(flags.verbose, location, version)
      start.cleanupSetupFiles()
      logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
      break

      case 'event-store-db':
        start.dependencyCheck(flags.verbose)
        start.startDevServer(flags.verbose)
        start.cleanupSetupFiles()
        // install customerOS
        cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true)
        ns.installNamespace(flags.verbose, location)
        installEventStoreDB(flags.verbose, location)
        start.cleanupSetupFiles()
        logTerminal('INFO', 'to ensure everything was installed correctly, run => openline dev ping')
        break
    }
  }
}
