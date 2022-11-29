import {Command, Flags} from '@oclif/core'
import * as shell from 'shelljs'
import {deleteApp} from '../../lib/dev/delete'
import {logError} from '../../lib/dev/errors'

export default class DevDelete extends Command {
  static description = 'describe the command here'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    all: Flags.boolean({char: 'a', description: 'delete all Openline services'}),
    verbose: Flags.boolean({char: 'v'}),
  }

  static args = [
    {
      name: 'app',
      required: false,
      description: 'the Openline app you would like to delete',
      default: 'customer-os',
      options: ['customer-os', 'contacts', 'oasis'],
    },
  ]

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(DevDelete)
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
      if (args.app.toLowerCase() === 'customer-os') {
        deployments = ['customer-os-api', 'message-store', 'fusionauth-customer-os']
        services = [
          'neo4j-customer-os',
          'neo4j-customer-os-admin',
          'postgresql-customer-os-dev-hl',
          'postgresql-customer-os-dev',
          'fusionauth-customer-os',
          'neo4j-customer-os-neo4j',
          'customer-os-api-service',
          'customer-os-api-loadbalancer',
          'message-store-service',
          'message-store-loadbalancer-service',
        ]
      } else if (args.app.toLowerCase() === 'contacts') {
        deployments = ['contacts-gui']
        services = ['contacts-gui-service', 'contacts-gui-loadbalancer']
      } else if (args.app.toLowerCase === 'oasis') {
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

      const deleted = deleteApp(deployments, services, flags.verbose)
      if (deleted) {
        console.log(`✅ ${args.app} deleted successfully`)
      }
    }
  }
}

