import {Command, Flags} from '@oclif/core'
import {uninstallFusionAuth} from '../../lib/dev/auth'
import {uninstallNeo4j} from '../../lib/dev/neo4j'
import {uninstallPostgresql} from '../../lib/dev/postgres'
import {deleteAll, deleteApp, Apps} from '../../lib/dev/delete'
import * as colima from '../../lib/dev/colima'
import * as k3d from '../../lib/dev/k3d'

import {getPlatform} from '../../lib/dependencies'

export default class DevRm extends Command {
  static description = 'Delete Openline services'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    all: Flags.boolean({description: 'delete all Openline services and stop the Openline dev server'}),
    verbose: Flags.boolean({char: 'v'}),
  }

  static args = [
    {
      name: 'service',
      required: false,
      description: 'the Openline service or group of services you would like to delete',
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
        'voice',
        'kamailio',
        'asterisk',
        'voice-plugin'
      ],
    },
  ]

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(DevRm)

    switch (getPlatform()) {
      case "mac":
        if (!colima.contextCheck(flags.verbose)) this.exit(1)
        break
      case "linux":
        if (!k3d.contextCheck(flags.verbose)) this.exit(1)
        break
    }

    if (flags.all) {
      deleteAll(flags.verbose)
      this.exit(0)
    }

    const service = args.service.toLowerCase()
    switch (service) {
    case 'auth':
      const authApps: Apps = {
        deployments: [],
        services: ['auth-fusionauth-loadbalancer'],
        statefulsets: [],
      }

      uninstallFusionAuth(flags.verbose)
      deleteApp(authApps, flags.verbose)
      break

    case 'contacts':
      const contactApps: Apps = {
        deployments: ['contacts-gui'],
        services: ['contacts-gui-service', 'contacts-gui-loadbalancer'],
        statefulsets: [],
      }

      deleteApp(contactApps, flags.verbose)
      break

    case 'contacts-gui':
      const contactsGuiApps:Apps = {
        deployments: ['contacts-gui'],
        services: ['contacts-gui-service', 'contacts-gui-loadbalancer'],
        statefulsets: []
      }
      deleteApp(contactsGuiApps, flags.verbose)
      break

    case 'customer-os':
      const customerOsApps:Apps = {
        deployments: ['customer-os-api', 'message-store-api'],
        services: [
          'customer-os-api-service',
          'customer-os-api-loadbalancer',
          'message-store-api-service',
          'message-store-api-loadbalancer',
        ],
        statefulsets: []
      }

      deleteApp(customerOsApps, flags.verbose)
      break

    case 'customer-os-api':
      const customerOsAPIApps:Apps = {
        deployments: ['customer-os-api'],
        services: ['customer-os-api-service', 'customer-os-api-loadbalancer'],
        statefulsets: []
      }

      deleteApp(customerOsAPIApps, flags.verbose)
      break

    case 'db':
      uninstallNeo4j(flags.verbose)
      uninstallPostgresql(flags.verbose)
      break
    

    case 'message-store-api':
      const messageStoreApiApps: Apps = {
        deployments: ['message-store-api'],
        services: ['message-store-api-service', 'message-store-api-loadbalancer'],
        statefulsets: []
      }
      deleteApp(messageStoreApiApps, flags.verbose)
      break
    

    // Oasis Services  
    case 'oasis':
      const oasisApps:Apps = {
        deployments: ['oasis-api', 'channels-api', 'oasis-frontend'],
        services: [
          'oasis-api-service',
          'oasis-api-loadbalancer',
          'channels-api-service',
          'channels-api-loadbalancer',
          'oasis-frontend-service',
          'oasis-frontend-loadbalancer',
        ],
        statefulsets: [],
      }

      deleteApp(oasisApps, flags.verbose)
      break

    case 'oasis-api':
      const oasisApiApps:Apps = {
        deployments: ['oasis-api'],
        services: ['oasis-api-service', 'oasis-api-loadbalancer'],
        statefulsets: [],
      }

      deleteApp(oasisApiApps, flags.verbose)
      break

    case 'oasis-gui':
      const oasisGuiApps:Apps = {
        deployments: ['oasis-frontend'],
        services: ['oasis-frontend-service', 'oasis-frontend-loadbalancer'],
        statefulsets: [],
      }

      deleteApp(oasisGuiApps, flags.verbose)
      break

    case 'channels-api':
      const oasisChannelApiApps:Apps = {
        deployments: ['channels-api'],
        services: ['channels-api-service', 'channels-api-loadbalancer'],
        statefulsets: []
      }

      deleteApp(oasisChannelApiApps, flags.verbose)
      break

    // Voice Services
    case 'voice':
      const voiceApps: Apps = {
        deployments: ['kamailio', 'voice-plugin'],
        services: [
          'asterisk',
          'kamailio-loadbalancer-service',
          'kamailio-service',
          'voice-plugin-service',
        ],
        statefulsets: ['asterisk'],
      }

      deleteApp(voiceApps, flags.verbose)
      break

    case 'kamailio':
      const kamailioApps: Apps = {
        deployments: ['kamailio'],
        services: [
          'kamailio-loadbalancer-service',
          'kamailio-service',
        ],
        statefulsets: [],
      }
      deleteApp(kamailioApps, flags.verbose)
      break

    case 'asterisk':
      const asteriskApps: Apps = {
        deployments: [],
        services: [
          'asterisk',
        ],
        statefulsets: ['asterisk'],
      }
      deleteApp(asteriskApps, flags.verbose)
      break
    case 'voice-plugin':
      const voicePluginApps: Apps = {
        deployments: ['voice-plugin'],
        services: [
          'voice-plugin-service',
        ],
        statefulsets: [],
      }
      deleteApp(voicePluginApps, flags.verbose)
      break    
    }
  }
}

