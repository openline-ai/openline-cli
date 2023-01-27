import {Command} from '@oclif/core'
import {pingContactsGui} from '../../lib/dev/contacts'
import {pingCustomerOsApi, pingMessageStoreApi, pingSettingsApi} from '../../lib/dev/customer-os'
import {pingOasisGui, pingOasisApi, pingChannelsApi} from '../../lib/dev/oasis'
import {pingKamailio} from '../../lib/dev/voice'

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

    const contactsGui = pingContactsGui() ? colors.bold.green('Yes') : colors.red.bold('No')
    const customerOsApi = pingCustomerOsApi() ? colors.bold.green('Yes') : colors.red.bold('No')
    const messageStoreApi = pingMessageStoreApi() ? colors.bold.green('Yes') : colors.red.bold('No')
    const settingsApi = pingSettingsApi() ? colors.bold.green('Yes') : colors.red.bold('No')
    const channelsApi = pingChannelsApi() ? colors.bold.green('Yes') : colors.red.bold('No')
    const oasisApi = pingOasisApi() ? colors.bold.green('Yes') : colors.red.bold('No')
    const oasisGui = pingOasisGui() ? colors.bold.green('Yes') : colors.red.bold('No')
    const voiceKamailio = pingKamailio() ? colors.bold.green('Yes') : colors.red.bold('No')

    const table = new Table({
      head: [colors.cyan.bold('App'), colors.cyan.bold('Service'), colors.cyan.bold('Location'), colors.cyan.bold('Up?')],
      colWidths: [15, 20, 25, 5],
    })

    table.push(
      ['customer-os', 'customer-os-api', 'http://localhost:10000', customerOsApi],
      ['customer-os', 'message-store-api', 'http://localhost:9009', messageStoreApi],
      ['customer-os', 'settings-api', 'http://localhost:10002', settingsApi],
      ['contacts', 'contacts-gui', 'http://localhost:3001', contactsGui],
      ['oasis', 'channels-api', 'http://localhost:8013', channelsApi],
      ['oasis', 'oasis-api', 'http://localhost:8006', oasisApi],
      ['oasis', 'oasis-gui', 'http://localhost:3006', oasisGui],
      ['voice', 'kamailio', 'ws://localhost:8080', voiceKamailio],

    )

    console.log(table.toString())
  }
}
