import {Command} from '@oclif/core'
import {pingFusionAuth} from '../../lib/dev/auth'
import {pingContactsGui} from '../../lib/dev/contacts'
import {pingCustomerOsApi, pingMessageStoreApi} from '../../lib/dev/customer-os'
import {pingOasisGui, pingOasisApi, pingChannelsApi} from '../../lib/dev/oasis'
const Table = require('cli-table') // eslint-disable-line unicorn/prefer-module

export default class DevPing extends Command {
  static description = 'heath check to determine if openline service is up'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {}

  static args = []

  public async run(): Promise<void> {
    // const {flags} = await this.parse(DevPing)

    // const auth = pingFusionAuth() ? '✅' : '❌'
    const contactsGui = pingContactsGui() ? '✅' : '❌'
    const customerOsApi = pingCustomerOsApi() ? '✅' : '❌'
    const messageStoreApi = pingMessageStoreApi() ? '✅' : '❌'
    const channelsApi = pingChannelsApi() ? '✅' : '❌'
    const oasisApi = pingOasisApi() ? '✅' : '❌'
    const oasisGui = pingOasisGui() ? '✅' : '❌'

    const table = new Table({
      head: ['App', 'Service', 'Port', 'Reachable?'],
      // colWidths: [100, 100, 100]
    })

    table.push(
      // ['customerOs', 'auth', auth],
      ['customer-os', 'customer-os-api', '10000', customerOsApi],
      ['customer-os', 'message-store-api', '9009', messageStoreApi],
      ['contacts', 'contacts-gui', '3000', contactsGui],
      ['oasis', 'channels-api', '8013', channelsApi],
      ['oasis', 'oasis-api', '8006', oasisApi],
      ['oasis', 'oasis-gui', '3006', oasisGui],
    )

    console.log(table.toString())
  }
}
