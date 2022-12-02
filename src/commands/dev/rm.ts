import {Command, Flags} from '@oclif/core'
import * as shell from 'shelljs'
import {uninstallFusionAuth} from '../../lib/dev/auth'
import {uninstallNeo4j} from '../../lib/dev/neo4j'
import {uninstallPostgresql} from '../../lib/dev/postgres'
import {deleteApp} from '../../lib/dev/delete'
import {logError} from '../../lib/dev/errors'
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
        'customer-os',
        'contacts',
        'oasis',
        'auth',
        'db',
        'customer-os-api',
        'message-store-api',
        'oasis-api',
        'channels-api',
        'contacts-gui',
        'oasis-gui',
      ],
    },
  ]

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(DevRm)
    let deployments :string[] = []
    let services :string[] = []

    if (!contextCheck(flags.verbose)) this.exit(1)

    if (flags.all) {
      const reset = shell.exec('colima kubernetes reset', {silent: !flags.verbose})
      if (reset.code === 0) {
        console.log('✅ Openline dev server deleted')
        console.log('💡 to stop the dev server, run => openline dev stop')
      } else {
        logError('Problem deleting Openline dev server', 'Let\'s nuke it from orbit...')
      }
    } else {
      let deleted = false
      if (args.service.toLowerCase() === 'customer-os') {
        // deletes customer-os-api and message-store-api, but leaves auth and db in place
        deployments = ['customer-os-api', 'message-store']
        services = [
          'customer-os-api-service',
          'customer-os-api-loadbalancer',
          'message-store-service',
          'message-store-loadbalancer-service',
        ]
      }

      if (args.service.toLowerCase() === 'contacts') {
        deployments = ['contacts-gui']
        services = ['contacts-gui-service', 'contacts-gui-loadbalancer']
      }

      if (args.service.toLowerCase() === 'oasis') {
        deployments = ['oasis-api', 'channels-api', 'oasis-frontend']
        services = [
          'oasis-api-service',
          'oasis-api-loadbalancer',
          'channels-api-service',
          'channels-api-loadbalancer',
          'oasis-frontend-service',
          'oasis-frontend-loadbalancer',
        ]
      }

      if (args.service.toLowerCase() === 'customer-os-api') {
        deployments = ['customer-os-api']
        services = ['customer-os-api-service', 'customer-os-api-loadbalancer']
      }

      if (args.service.toLowerCase() === 'message-store-api') {
        deployments = ['message-store']
        services = ['message-store-service', 'message-store-loadbalancer-service']
      }

      if (args.service.toLowerCase() === 'oasis-api') {
        deployments = ['oasis-api']
        services = ['oasis-api-service', 'oasis-api-loadbalancer']
      }

      if (args.service.toLowerCase() === 'channels-api') {
        deployments = ['channels-api']
        services = ['channels-api-service', 'channels-api-loadbalancer']
      }

      if (args.service.toLowerCase() === 'oasis-gui') {
        deployments = ['oasis-frontend']
        services = ['oasis-frontend-service', 'oasis-frontend-loadbalancer']
      }

      if (args.service.toLowerCase() === 'contacts-gui') {
        deployments = ['contacts-gui']
        services = ['contacts-gui-service', 'contacts-gui-loadbalancer']
      }

      if (args.service.toLowerCase() === 'auth') {
        const helmDeleted = uninstallFusionAuth(flags.verbose)
        if (!helmDeleted) this.exit(1)
        deployments = []
        services = ['fusion-auth-loadbalancer']
      }

      if (args.service.toLowerCase() === 'db') {
        deleted = uninstallNeo4j(flags.verbose)
        if (deleted) {
          deleted = uninstallPostgresql(flags.verbose)
        }
      }

      if (deployments.length > 0 || services.length > 0) {
        deleted = deleteApp(deployments, services, flags.verbose)
      }

      if (deleted) {
        console.log(`✅ ${args.service} deleted successfully`)
      }
    }
  }
}

