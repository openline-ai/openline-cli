import {Command, Flags} from '@oclif/core'
import {uninstallFusionAuth} from '../../lib/dev/auth'
import {uninstallNeo4j} from '../../lib/dev/neo4j'
import {uninstallPostgresql} from '../../lib/dev/postgres'
import {deleteAll, deleteApp} from '../../lib/dev/delete'
import {contextCheck} from '../../lib/dev/colima'

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
      ],
    },
  ]

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(DevRm)
    let deployments :string[] = []
    let services :string[] = []

    if (!contextCheck(flags.verbose)) this.exit(1)

    if (flags.all) {
      deleteAll(flags.verbose)
      this.exit(0)
    }

    const service = args.service.toLowerCase()
    switch (service) {
    case 'auth':
      deployments = []
      services = ['fusion-auth-loadbalancer']
      uninstallFusionAuth(flags.verbose)
      deleteApp(deployments, services, flags.verbose)
      break

    case 'channels-api':
      deployments = ['channels-api']
      services = ['channels-api-service', 'channels-api-loadbalancer']
      deleteApp(deployments, services, flags.verbose)
      break

    case 'contacts':
      deployments = ['contacts-gui']
      services = ['contacts-gui-service', 'contacts-gui-loadbalancer']
      deleteApp(deployments, services, flags.verbose)
      break

    case 'contacts-gui':
      deployments = ['contacts-gui']
      services = ['contacts-gui-service', 'contacts-gui-loadbalancer']
      deleteApp(deployments, services, flags.verbose)
      break

    case 'customer-os':
      deployments = ['customer-os-api', 'message-store']
      services = [
        'customer-os-api-service',
        'customer-os-api-loadbalancer',
        'message-store-service',
        'message-store-loadbalancer-service',
      ]
      deleteApp(deployments, services, flags.verbose)
      break

    case 'customer-os-api':
      deployments = ['customer-os-api']
      services = ['customer-os-api-service', 'customer-os-api-loadbalancer']
      deleteApp(deployments, services, flags.verbose)
      break

    case 'db':
      uninstallNeo4j(flags.verbose)
      uninstallPostgresql(flags.verbose)
      break

    case 'oasis':
      deployments = ['oasis-api', 'channels-api', 'oasis-frontend']
      services = [
        'oasis-api-service',
        'oasis-api-loadbalancer',
        'channels-api-service',
        'channels-api-loadbalancer',
        'oasis-frontend-service',
        'oasis-frontend-loadbalancer',
      ]
      deleteApp(deployments, services, flags.verbose)
      break

    case 'oasis-api':
      deployments = ['oasis-api']
      services = ['oasis-api-service', 'oasis-api-loadbalancer']
      deleteApp(deployments, services, flags.verbose)
      break

    case 'oasis-gui':
      deployments = ['oasis-frontend']
      services = ['oasis-frontend-service', 'oasis-frontend-loadbalancer']
      deleteApp(deployments, services, flags.verbose)
      break

    case 'message-store-api':
      deployments = ['message-store']
      services = ['message-store-service', 'message-store-loadbalancer-service']
      deleteApp(deployments, services, flags.verbose)
      break
    }
  }
}

