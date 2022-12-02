import {Command} from '@oclif/core'
import {pingFusionAuth} from '../../lib/dev/auth'
import {pingContactsGui} from '../../lib/dev/contacts'
import {pingCustomerOsApi, pingMessageStoreApi} from '../../lib/dev/customer-os'
import {pingOasisGui, pingOasisApi, pingChannelsApi} from '../../lib/dev/oasis'
import * as colors from 'colors' // eslint-disable-line no-restricted-imports
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

    const auth = pingFusionAuth() ? colors.bold.green('Yes') : colors.red.bold('No')
    const contactsGui = pingContactsGui() ? colors.bold.green('Yes') : colors.red.bold('No')
    const customerOsApi = pingCustomerOsApi() ? colors.bold.green('Yes') : colors.red.bold('No')
    const messageStoreApi = pingMessageStoreApi() ? colors.bold.green('Yes') : colors.red.bold('No')
    const channelsApi = pingChannelsApi() ? colors.bold.green('Yes') : colors.red.bold('No')
    const oasisApi = pingOasisApi() ? colors.bold.green('Yes') : colors.red.bold('No')
    const oasisGui = pingOasisGui() ? colors.bold.green('Yes') : colors.red.bold('No')

    const table = new Table({
      head: [colors.cyan.bold('App'), colors.cyan.bold('Service'), colors.cyan.bold('Port'), colors.cyan.bold('Up?')],
      colWidths: [15, 20, 10, 5],
    })

    table.push(
      ['customerOs', 'auth', '9011', auth],
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
