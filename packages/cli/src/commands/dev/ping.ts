import {Command} from '@oclif/core'
import {pingContactsGui} from '../../lib/dev/contacts'
import {pingCustomerOsApi, pingfileStoreApi, pingSettingsApi, pingCommsApi, pingEventsStoreDb} from '../../lib/dev/customer-os'
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
    const settingsApi = pingSettingsApi() ? colors.bold.green('Yes') : colors.red.bold('No')
    const fileStoreApi = pingfileStoreApi() ? colors.bold.green('Yes') : colors.red.bold('No')
    const eventsProcessingPlatform = pingEventsStoreDb() ? colors.bold.green('Yes') : colors.red.bold('No')
    const commsApi = pingCommsApi() ? colors.bold.green('Yes') : colors.red.bold('No')
    const voiceKamailio = pingKamailio() ? colors.bold.green('Yes') : colors.red.bold('No')

    const table = new Table({
      head: [colors.cyan.bold('App'), colors.cyan.bold('Service'), colors.cyan.bold('Location'), colors.cyan.bold('Up?')],
      colWidths: [15, 20, 25, 5],
    })

    table.push(
      ['customer-os', 'customer-os-api', 'http://localhost:10000', customerOsApi],
      ['customer-os', 'file-store-api', 'http://localhost:10001', fileStoreApi],
      ['customer-os', 'settings-api', 'http://localhost:10002', settingsApi],
      ['customer-os', 'comms-api', 'http://localhost:8013', commsApi],
      ['customer-os', 'events-processing-platform', 'http://localhost:2113', eventsProcessingPlatform],
      ['contacts', 'contacts-gui', 'http://localhost:3001', contactsGui],
      ['voice', 'kamailio', 'ws://localhost:8080', voiceKamailio],

    )

    console.log(table.toString())
  }
}
