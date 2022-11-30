import {Command, Flags} from '@oclif/core'
import * as shell from 'shelljs'
import {deleteApp} from '../../lib/dev/delete'
import {logError} from '../../lib/dev/errors'

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

    if (flags.all) {
      const reset = shell.exec('colima kubernetes reset', {silent: !flags.verbose})
      const stop = shell.exec('colima stop')
      if (reset.code === 0 && stop.code === 0) {
        console.log('✅ Openline dev server deleted')
      } else {
        logError('Problem deleting Openline dev server', 'Let\'s nuke it from orbit...')
      }
    } else {
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

      if (args.service.toLowerCase() === 'auth') {
        deployments = ['fusionauth-customer-os']
        services = ['fusionauth-customer-os']
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

      const deleted = deleteApp(deployments, services, flags.verbose)
      if (deleted) {
        console.log(`✅ ${args.service} deleted successfully`)
      }
    }
  }
}

