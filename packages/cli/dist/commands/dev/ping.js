"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const auth_1 = require("../../lib/dev/auth");
const contacts_1 = require("../../lib/dev/contacts");
const customer_os_1 = require("../../lib/dev/customer-os");
const oasis_1 = require("../../lib/dev/oasis");
const voice_1 = require("../../lib/dev/voice");
const colors = require("colors"); // eslint-disable-line no-restricted-imports
const Table = require('cli-table'); // eslint-disable-line unicorn/prefer-module
class DevPing extends core_1.Command {
    async run() {
        // const {flags} = await this.parse(DevPing)
        const auth = (0, auth_1.pingFusionAuth)() ? colors.bold.green('Yes') : colors.red.bold('No');
        const contactsGui = (0, contacts_1.pingContactsGui)() ? colors.bold.green('Yes') : colors.red.bold('No');
        const customerOsApi = (0, customer_os_1.pingCustomerOsApi)() ? colors.bold.green('Yes') : colors.red.bold('No');
        const messageStoreApi = (0, customer_os_1.pingMessageStoreApi)() ? colors.bold.green('Yes') : colors.red.bold('No');
        const channelsApi = (0, oasis_1.pingChannelsApi)() ? colors.bold.green('Yes') : colors.red.bold('No');
        const oasisApi = (0, oasis_1.pingOasisApi)() ? colors.bold.green('Yes') : colors.red.bold('No');
        const oasisGui = (0, oasis_1.pingOasisGui)() ? colors.bold.green('Yes') : colors.red.bold('No');
        const voiceKamailio = (0, voice_1.pingKamailio)() ? colors.bold.green('Yes') : colors.red.bold('No');
        const table = new Table({
            head: [colors.cyan.bold('App'), colors.cyan.bold('Service'), colors.cyan.bold('Location'), colors.cyan.bold('Up?')],
            colWidths: [15, 20, 25, 5],
        });
        table.push(['customer-os', 'auth', 'http://localhost:9011', auth], ['customer-os', 'customer-os-api', 'http://localhost:10000', customerOsApi], ['customer-os', 'message-store-api', 'http://localhost:9009', messageStoreApi], ['contacts', 'contacts-gui', 'http://localhost:3001', contactsGui], ['oasis', 'channels-api', 'http://localhost:8013', channelsApi], ['oasis', 'oasis-api', 'http://localhost:8006', oasisApi], ['oasis', 'oasis-gui', 'http://localhost:3006', oasisGui], ['voice', 'kamailio', 'ws://localhost:8080', voiceKamailio]);
        console.log(table.toString());
    }
}
exports.default = DevPing;
DevPing.description = 'heath check to determine if openline service is up';
DevPing.examples = [
    '<%= config.bin %> <%= command.id %>',
];
DevPing.flags = {};
DevPing.args = [];
