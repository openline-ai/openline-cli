/* eslint-disable complexity */
import {Command, Flags} from '@oclif/core'
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
        'channels-api',
        'comms-api',
        'contacts',
        'contacts-gui',
        'customer-os',
        'customer-os-api',
        'db',
        'file-store-api',
        'settings-api',
        'voice',
        'kamailio',
        'asterisk',
        'voice-plugin',
        'ory-tunnel',
        'event-store-db',
      ],
    },
  ]

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(DevRm)

    switch (getPlatform()) {
    case 'mac':
      if (!colima.contextCheck(flags.verbose)) this.exit(1)
      break
    case 'linux':
      if (!k3d.contextCheck(flags.verbose)) this.exit(1)
      break
    }

    if (flags.all) {
      deleteAll(flags.verbose)
      this.exit(0)
    }

    const service = args.service.toLowerCase()
    switch (service) {

    case 'contacts': {
      const appServices: Apps = {
        deployments: ['contacts-gui'],
        services: ['contacts-gui-service', 'contacts-gui-loadbalancer'],
        statefulsets: [],
      }

      deleteApp(appServices, flags.verbose)
      break
    }

    case 'contacts-gui': {
      const appServices: Apps = {
        deployments: ['contacts-gui'],
        services: ['contacts-gui-service', 'contacts-gui-loadbalancer'],
        statefulsets: [],
      }
      deleteApp(appServices, flags.verbose)
      break
    }

    case 'customer-os': {
      const appServices: Apps = {
        deployments: ['customer-os-api', 'message-store-api','comms-api'],
        services: [
          'customer-os-api-service',
          'customer-os-api-loadbalancer',
          'message-store-api-service',
          'message-store-api-loadbalancer',
          'comms-api-service',
          'comms-api-service-loadbalancer',
        ],
        statefulsets: [],
      }

      deleteApp(appServices, flags.verbose)
      break
    }

    case 'customer-os-api': {
      const appServices: Apps = {
        deployments: ['customer-os-api'],
        services: ['customer-os-api-service', 'customer-os-api-loadbalancer'],
        statefulsets: [],
      }

      deleteApp(appServices, flags.verbose)
      break
    }

    case 'db':
      uninstallNeo4j(flags.verbose)
      uninstallPostgresql(flags.verbose)
      break

    case 'message-store-api': {
      const appServices: Apps = {
        deployments: ['message-store-api'],
        services: ['message-store-api-service', 'message-store-api-loadbalancer'],
        statefulsets: [],
      }
      deleteApp(appServices, flags.verbose)
      break
    }

    case 'settings-api': {
      const appServices: Apps = {
        deployments: ['settings-api'],
        services: ['settings-api-service', 'settings-api-loadbalancer'],
        statefulsets: [],
      }
      deleteApp(appServices, flags.verbose)
      break
    }

    case 'file-store-api': {
      const appServices: Apps = {
        deployments: ['file-store-api'],
        services: ['file-store-api-service', 'file-store-api-loadbalancer'],
        statefulsets: [],
      }
      deleteApp(appServices, flags.verbose)
      break
    }

    case 'comms-api': {
      const appServices: Apps = {
        deployments: ['comms-api'],
        services: ['comms-api-service', 'comms-api-loadbalancer'],
        statefulsets: [],
      }

      deleteApp(appServices, flags.verbose)
      break
    }

    // Voice Services
    case 'voice': {
      const appServices: Apps = {
        deployments: ['kamailio', 'voice-plugin'],
        services: [
          'asterisk',
          'kamailio-loadbalancer-service',
          'kamailio-service',
          'voice-plugin-service',
        ],
        statefulsets: ['asterisk'],
      }

      deleteApp(appServices, flags.verbose)
      break
    }

    case 'kamailio': {
      const appServices: Apps = {
        deployments: ['kamailio'],
        services: [
          'kamailio-loadbalancer-service',
          'kamailio-service',
        ],
        statefulsets: [],
      }
      deleteApp(appServices, flags.verbose)
      break
    }

    case 'asterisk': {
      const appServices: Apps = {
        deployments: [],
        services: [
          'asterisk',
        ],
        statefulsets: ['asterisk'],
      }
      deleteApp(appServices, flags.verbose)
      break
    }
    case 'ory-tunnel': {
      const appServices: Apps = {
        deployments: [],
        services: [
          'ory-tunnel-service',
          'ory-tunnel-loadbalancer',
        ],
        statefulsets: ['ory-tunnel'],
      }
      deleteApp(appServices, flags.verbose)
      break
    }
    case 'voice-plugin': {
      const appServices: Apps = {
        deployments: ['voice-plugin'],
        services: [
          'voice-plugin-service',
        ],
        statefulsets: [],
      }
      deleteApp(appServices, flags.verbose)
      break
    }
    }
  }
}
