"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable complexity */
const core_1 = require("@oclif/core");
const ns = require("../../lib/dev/namespace");
const neo = require("../../lib/dev/neo4j");
const sql = require("../../lib/dev/postgres");
const fusionauth = require("../../lib/dev/auth");
const dev_1 = require("../../config/dev");
const customer_os_1 = require("../../lib/dev/customer-os");
const contacts_1 = require("../../lib/dev/contacts");
const oasis = require("../../lib/dev/oasis");
const voice = require("../../lib/dev/voice");
const start = require("../../lib/dev/start");
const clone_repo_1 = require("../../lib/clone/clone-repo");
const logs_1 = require("../../lib/logs");
class DevStart extends core_1.Command {
    async run() {
        const { flags, args } = await this.parse(DevStart);
        const config = (0, dev_1.getConfig)();
        let location = flags.location;
        let version = flags.tag;
        if (flags.test) {
            this.exit(0);
        }
        // cleanup any old setup files
        start.cleanupSetupFiles();
        // if building from local files, set version to <local>
        if (location) {
            version = 'local';
            if (location[0] !== '/')
                location = '/' + location;
        }
        if (flags.all) {
            start.dependencyCheck(flags.verbose);
            start.startDevServer(flags.verbose);
            // install customerOS
            (0, clone_repo_1.cloneRepo)(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true);
            ns.installNamespace(flags.verbose, location);
            start.installDatabases(flags.verbose, location);
            fusionauth.installFusionAuth(flags.verbose, location);
            (0, customer_os_1.installCustomerOsApi)(flags.verbose, location, version);
            (0, customer_os_1.installMessageStoreApi)(flags.verbose, location, version);
            sql.provisionPostgresql(flags.verbose, location);
            neo.provisionNeo4j(flags.verbose, location);
            start.cleanupSetupFiles();
            // install contacts
            (0, clone_repo_1.cloneRepo)(config.contacts.repo, flags.verbose, config.setupDir, undefined, true);
            (0, contacts_1.installContactsGui)(flags.verbose, location, version);
            start.cleanupSetupFiles();
            // install oasis
            (0, clone_repo_1.cloneRepo)(config.oasis.repo, flags.verbose, config.setupDir, undefined, true);
            oasis.installChannelsApi(flags.verbose, location, version);
            oasis.installOasisApi(flags.verbose, location, version);
            oasis.installOasisGui(flags.verbose, location, version);
            start.cleanupSetupFiles();
            (0, logs_1.logTerminal)('SUCCESS', 'Openline dev server has been started');
            (0, logs_1.logTerminal)('INFO', 'to ensure everything was installed correctly, run => openline dev ping');
            this.exit(0);
        }
        const app = args.app.toLowerCase();
        switch (app) {
            case 'auth':
                start.dependencyCheck(flags.verbose);
                start.startDevServer(flags.verbose);
                (0, clone_repo_1.cloneRepo)(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true);
                ns.installNamespace(flags.verbose, location);
                fusionauth.installFusionAuth(flags.verbose, location);
                start.cleanupSetupFiles();
                (0, logs_1.logTerminal)('INFO', 'to ensure everything was installed correctly, run => openline dev ping');
                break;
            case 'contacts':
                start.dependencyCheck(flags.verbose);
                start.startDevServer(flags.verbose);
                // install customerOS
                (0, clone_repo_1.cloneRepo)(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true);
                ns.installNamespace(flags.verbose, location);
                start.installDatabases(flags.verbose, location);
                fusionauth.installFusionAuth(flags.verbose, location);
                (0, customer_os_1.installCustomerOsApi)(flags.verbose, location, version);
                (0, customer_os_1.installMessageStoreApi)(flags.verbose, location, version);
                sql.provisionPostgresql(flags.verbose, location);
                neo.provisionNeo4j(flags.verbose, location);
                start.cleanupSetupFiles();
                // install contacts
                (0, clone_repo_1.cloneRepo)(config.contacts.repo, flags.verbose, config.setupDir, undefined, true);
                (0, contacts_1.installContactsGui)(flags.verbose, location, version);
                start.cleanupSetupFiles();
                (0, logs_1.logTerminal)('INFO', 'to ensure everything was installed correctly, run => openline dev ping');
                break;
            case 'contacts-gui':
                start.dependencyCheck(flags.verbose);
                start.startDevServer(flags.verbose);
                (0, clone_repo_1.cloneRepo)(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true);
                ns.installNamespace(flags.verbose, location);
                start.cleanupSetupFiles();
                (0, clone_repo_1.cloneRepo)(config.contacts.repo, flags.verbose, config.setupDir, undefined, true);
                (0, contacts_1.installContactsGui)(flags.verbose, location, version);
                start.cleanupSetupFiles();
                (0, logs_1.logTerminal)('INFO', 'to ensure everything was installed correctly, run => openline dev ping');
                break;
            case 'customer-os':
                start.dependencyCheck(flags.verbose);
                start.startDevServer(flags.verbose);
                // install customerOS
                (0, clone_repo_1.cloneRepo)(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true);
                ns.installNamespace(flags.verbose, location);
                start.installDatabases(flags.verbose, location);
                fusionauth.installFusionAuth(flags.verbose, location);
                (0, customer_os_1.installCustomerOsApi)(flags.verbose, location, version);
                (0, customer_os_1.installMessageStoreApi)(flags.verbose, location, version);
                sql.provisionPostgresql(flags.verbose, location);
                neo.provisionNeo4j(flags.verbose, location);
                start.cleanupSetupFiles();
                (0, logs_1.logTerminal)('INFO', 'to ensure everything was installed correctly, run => openline dev ping');
                break;
            case 'customer-os-api':
                start.dependencyCheck(flags.verbose);
                start.startDevServer(flags.verbose);
                // install customerOS
                (0, clone_repo_1.cloneRepo)(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true);
                ns.installNamespace(flags.verbose, location);
                (0, customer_os_1.installCustomerOsApi)(flags.verbose, location, version);
                (0, logs_1.logTerminal)('INFO', 'to ensure everything was installed correctly, run => openline dev ping');
                break;
            case 'db':
                start.dependencyCheck(flags.verbose);
                start.startDevServer(flags.verbose);
                // install customerOS
                (0, clone_repo_1.cloneRepo)(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true);
                ns.installNamespace(flags.verbose, location);
                start.installDatabases(flags.verbose, location);
                sql.provisionPostgresql(flags.verbose, location);
                neo.provisionNeo4j(flags.verbose, location);
                start.cleanupSetupFiles();
                (0, logs_1.logTerminal)('INFO', 'to ensure everything was installed correctly, run => openline dev ping');
                break;
            case 'oasis':
                start.dependencyCheck(flags.verbose);
                start.startDevServer(flags.verbose);
                // install customerOS
                (0, clone_repo_1.cloneRepo)(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true);
                ns.installNamespace(flags.verbose, location);
                start.installDatabases(flags.verbose, location);
                fusionauth.installFusionAuth(flags.verbose, location);
                (0, customer_os_1.installCustomerOsApi)(flags.verbose, location, version);
                (0, customer_os_1.installMessageStoreApi)(flags.verbose, location, version);
                sql.provisionPostgresql(flags.verbose, location);
                neo.provisionNeo4j(flags.verbose, location);
                start.cleanupSetupFiles();
                // install oasis
                (0, clone_repo_1.cloneRepo)(config.oasis.repo, flags.verbose, config.setupDir, undefined, true);
                oasis.installChannelsApi(flags.verbose, location, version);
                oasis.installOasisApi(flags.verbose, location, version);
                oasis.installOasisGui(flags.verbose, location, version);
                start.cleanupSetupFiles();
                (0, logs_1.logTerminal)('INFO', 'to ensure everything was installed correctly, run => openline dev ping');
                break;
            case 'oasis-api':
                start.dependencyCheck(flags.verbose);
                start.startDevServer(flags.verbose);
                (0, clone_repo_1.cloneRepo)(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true);
                ns.installNamespace(flags.verbose, location);
                start.cleanupSetupFiles();
                (0, clone_repo_1.cloneRepo)(config.oasis.repo, flags.verbose, config.setupDir, undefined, true);
                oasis.installOasisApi(flags.verbose, location, version);
                start.cleanupSetupFiles();
                (0, logs_1.logTerminal)('INFO', 'to ensure everything was installed correctly, run => openline dev ping');
                break;
            case 'oasis-gui':
                start.dependencyCheck(flags.verbose);
                start.startDevServer(flags.verbose);
                (0, clone_repo_1.cloneRepo)(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true);
                ns.installNamespace(flags.verbose, location);
                start.cleanupSetupFiles();
                (0, clone_repo_1.cloneRepo)(config.oasis.repo, flags.verbose, config.setupDir, undefined, true);
                oasis.installOasisGui(flags.verbose, location, version);
                start.cleanupSetupFiles();
                (0, logs_1.logTerminal)('INFO', 'to ensure everything was installed correctly, run => openline dev ping');
                break;
            case 'channels-api':
                start.dependencyCheck(flags.verbose);
                start.startDevServer(flags.verbose);
                (0, clone_repo_1.cloneRepo)(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true);
                ns.installNamespace(flags.verbose, location);
                start.cleanupSetupFiles();
                (0, clone_repo_1.cloneRepo)(config.oasis.repo, flags.verbose, config.setupDir, undefined, true);
                oasis.installChannelsApi(flags.verbose, location, version);
                start.cleanupSetupFiles();
                (0, logs_1.logTerminal)('INFO', 'to ensure everything was installed correctly, run => openline dev ping');
                break;
            case 'voice':
                start.dependencyCheck(flags.verbose);
                if (process.arch !== 'x64') {
                    (0, logs_1.logTerminal)('ERROR', 'Voice Platform only works on x86 machines, detected: ' + process.arch);
                    return;
                }
                start.startDevServer(flags.verbose);
                // install customerOS
                (0, clone_repo_1.cloneRepo)(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true);
                ns.installNamespace(flags.verbose, location);
                start.installDatabases(flags.verbose, location);
                fusionauth.installFusionAuth(flags.verbose, location);
                (0, customer_os_1.installCustomerOsApi)(flags.verbose, location, version);
                (0, customer_os_1.installMessageStoreApi)(flags.verbose, location, version);
                sql.provisionPostgresql(flags.verbose, location);
                neo.provisionNeo4j(flags.verbose, location);
                start.cleanupSetupFiles();
                // install oasis
                (0, clone_repo_1.cloneRepo)(config.oasis.repo, flags.verbose, config.setupDir, undefined, true);
                oasis.installChannelsApi(flags.verbose, location, version);
                oasis.installOasisApi(flags.verbose, location, version);
                oasis.installOasisGui(flags.verbose, location, version);
                start.cleanupSetupFiles();
                // install voice
                (0, clone_repo_1.cloneRepo)(config.voice.repo, flags.verbose, config.setupDir, undefined, true);
                voice.installKamailio(flags.verbose, location, version);
                voice.installAsterisk(flags.verbose, location, version);
                voice.installVoicePlugin(flags.verbose, location, version);
                start.cleanupSetupFiles();
                (0, logs_1.logTerminal)('INFO', 'to ensure everything was installed correctly, run => openline dev ping');
                break;
            case 'kamailio':
                start.dependencyCheck(flags.verbose);
                if (process.arch !== 'x64') {
                    (0, logs_1.logTerminal)('ERROR', 'Voice Platform only works on x86 machines, detected: ' + process.arch);
                    return;
                }
                start.startDevServer(flags.verbose);
                (0, clone_repo_1.cloneRepo)(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true);
                ns.installNamespace(flags.verbose, location);
                start.cleanupSetupFiles();
                (0, clone_repo_1.cloneRepo)(config.voice.repo, flags.verbose, config.setupDir, undefined, true);
                voice.installKamailio(flags.verbose, location, version);
                start.cleanupSetupFiles();
                (0, logs_1.logTerminal)('INFO', 'to ensure everything was installed correctly, run => openline dev ping');
                break;
            case 'asterisk':
                start.dependencyCheck(flags.verbose);
                if (process.arch !== 'x64') {
                    (0, logs_1.logTerminal)('ERROR', 'Voice Platform only works on x86 machines, detected: ' + process.arch);
                    return;
                }
                start.startDevServer(flags.verbose);
                (0, clone_repo_1.cloneRepo)(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true);
                ns.installNamespace(flags.verbose, location);
                start.cleanupSetupFiles();
                (0, clone_repo_1.cloneRepo)(config.voice.repo, flags.verbose, config.setupDir, undefined, true);
                voice.installAsterisk(flags.verbose, location, version);
                start.cleanupSetupFiles();
                (0, logs_1.logTerminal)('INFO', 'to ensure everything was installed correctly, run => openline dev ping');
                break;
            case 'voice-plugin':
                start.dependencyCheck(flags.verbose);
                if (process.arch !== 'x64') {
                    (0, logs_1.logTerminal)('ERROR', 'Voice Platform only works on x86 machines, detected: ' + process.arch);
                    return;
                }
                start.startDevServer(flags.verbose);
                (0, clone_repo_1.cloneRepo)(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true);
                ns.installNamespace(flags.verbose, location);
                start.cleanupSetupFiles();
                (0, clone_repo_1.cloneRepo)(config.voice.repo, flags.verbose, config.setupDir, undefined, true);
                voice.installVoicePlugin(flags.verbose, location, version);
                start.cleanupSetupFiles();
                (0, logs_1.logTerminal)('INFO', 'to ensure everything was installed correctly, run => openline dev ping');
                break;
            case 'message-store-api':
                start.dependencyCheck(flags.verbose);
                start.startDevServer(flags.verbose);
                // install customerOS
                (0, clone_repo_1.cloneRepo)(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true);
                ns.installNamespace(flags.verbose, location);
                (0, customer_os_1.installMessageStoreApi)(flags.verbose, location, version);
                (0, logs_1.logTerminal)('INFO', 'to ensure everything was installed correctly, run => openline dev ping');
                break;
        }
    }
}
exports.default = DevStart;
DevStart.description = 'Start an Openline development server';
DevStart.examples = [
    '<%= config.bin %> <%= command.id %>',
];
DevStart.flags = {
    all: core_1.Flags.boolean({ description: 'start all Openline apps & services' }),
    tag: core_1.Flags.string({
        char: 't',
        description: 'version tag of the image you would like to deploy',
        default: 'latest',
    }),
    location: core_1.Flags.string({
        char: 'l',
        description: 'location for the source code to be used in the installation',
    }),
    verbose: core_1.Flags.boolean({ char: 'v' }),
    test: core_1.Flags.boolean({ hidden: true }),
};
DevStart.args = [
    {
        name: 'app',
        required: false,
        description: 'the Openline application you would like to start',
        default: 'customer-os',
        options: [
            'asterisk',
            'auth',
            'channels-api',
            'contacts',
            'contacts-gui',
            'customer-os',
            'customer-os-api',
            'db',
            'kamailio',
            'message-store-api',
            'oasis',
            'oasis-api',
            'oasis-gui',
            'voice',
            'voice-plugin',
        ],
    },
];
