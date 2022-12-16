"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable complexity */
const core_1 = require("@oclif/core");
const auth_1 = require("../../lib/dev/auth");
const neo4j_1 = require("../../lib/dev/neo4j");
const postgres_1 = require("../../lib/dev/postgres");
const delete_1 = require("../../lib/dev/delete");
const colima = require("../../lib/dev/colima");
const k3d = require("../../lib/dev/k3d");
const dependencies_1 = require("../../lib/dependencies");
class DevRm extends core_1.Command {
    async run() {
        const { args, flags } = await this.parse(DevRm);
        switch ((0, dependencies_1.getPlatform)()) {
            case 'mac':
                if (!colima.contextCheck(flags.verbose))
                    this.exit(1);
                break;
            case 'linux':
                if (!k3d.contextCheck(flags.verbose))
                    this.exit(1);
                break;
        }
        if (flags.all) {
            (0, delete_1.deleteAll)(flags.verbose);
            this.exit(0);
        }
        const service = args.service.toLowerCase();
        switch (service) {
            case 'auth': {
                const appServices = {
                    deployments: [],
                    services: ['auth-fusionauth-loadbalancer'],
                    statefulsets: [],
                };
                (0, auth_1.uninstallFusionAuth)(flags.verbose);
                (0, delete_1.deleteApp)(appServices, flags.verbose);
                break;
            }
            case 'contacts': {
                const appServices = {
                    deployments: ['contacts-gui'],
                    services: ['contacts-gui-service', 'contacts-gui-loadbalancer'],
                    statefulsets: [],
                };
                (0, delete_1.deleteApp)(appServices, flags.verbose);
                break;
            }
            case 'contacts-gui': {
                const appServices = {
                    deployments: ['contacts-gui'],
                    services: ['contacts-gui-service', 'contacts-gui-loadbalancer'],
                    statefulsets: [],
                };
                (0, delete_1.deleteApp)(appServices, flags.verbose);
                break;
            }
            case 'customer-os': {
                const appServices = {
                    deployments: ['customer-os-api', 'message-store-api'],
                    services: [
                        'customer-os-api-service',
                        'customer-os-api-loadbalancer',
                        'message-store-api-service',
                        'message-store-api-loadbalancer',
                    ],
                    statefulsets: [],
                };
                (0, delete_1.deleteApp)(appServices, flags.verbose);
                break;
            }
            case 'customer-os-api': {
                const appServices = {
                    deployments: ['customer-os-api'],
                    services: ['customer-os-api-service', 'customer-os-api-loadbalancer'],
                    statefulsets: [],
                };
                (0, delete_1.deleteApp)(appServices, flags.verbose);
                break;
            }
            case 'db':
                (0, neo4j_1.uninstallNeo4j)(flags.verbose);
                (0, postgres_1.uninstallPostgresql)(flags.verbose);
                break;
            case 'message-store-api': {
                const appServices = {
                    deployments: ['message-store-api'],
                    services: ['message-store-api-service', 'message-store-api-loadbalancer'],
                    statefulsets: [],
                };
                (0, delete_1.deleteApp)(appServices, flags.verbose);
                break;
            }
            // Oasis Services
            case 'oasis': {
                const appServices = {
                    deployments: ['oasis-api', 'channels-api', 'oasis-gui'],
                    services: [
                        'oasis-api-service',
                        'oasis-api-loadbalancer',
                        'channels-api-service',
                        'channels-api-loadbalancer',
                        'oasis-gui-service',
                        'oasis-gui-loadbalancer',
                    ],
                    statefulsets: [],
                };
                (0, delete_1.deleteApp)(appServices, flags.verbose);
                break;
            }
            case 'oasis-api': {
                const appServices = {
                    deployments: ['oasis-api'],
                    services: ['oasis-api-service', 'oasis-api-loadbalancer'],
                    statefulsets: [],
                };
                (0, delete_1.deleteApp)(appServices, flags.verbose);
                break;
            }
            case 'oasis-gui': {
                const appServices = {
                    deployments: ['oasis-gui'],
                    services: ['oasis-gui-service', 'oasis-gui-loadbalancer'],
                    statefulsets: [],
                };
                (0, delete_1.deleteApp)(appServices, flags.verbose);
                break;
            }
            case 'channels-api': {
                const appServices = {
                    deployments: ['channels-api'],
                    services: ['channels-api-service', 'channels-api-loadbalancer'],
                    statefulsets: [],
                };
                (0, delete_1.deleteApp)(appServices, flags.verbose);
                break;
            }
            // Voice Services
            case 'voice': {
                const appServices = {
                    deployments: ['kamailio', 'voice-plugin'],
                    services: [
                        'asterisk',
                        'kamailio-loadbalancer-service',
                        'kamailio-service',
                        'voice-plugin-service',
                    ],
                    statefulsets: ['asterisk'],
                };
                (0, delete_1.deleteApp)(appServices, flags.verbose);
                break;
            }
            case 'kamailio': {
                const appServices = {
                    deployments: ['kamailio'],
                    services: [
                        'kamailio-loadbalancer-service',
                        'kamailio-service',
                    ],
                    statefulsets: [],
                };
                (0, delete_1.deleteApp)(appServices, flags.verbose);
                break;
            }
            case 'asterisk': {
                const appServices = {
                    deployments: [],
                    services: [
                        'asterisk',
                    ],
                    statefulsets: ['asterisk'],
                };
                (0, delete_1.deleteApp)(appServices, flags.verbose);
                break;
            }
            case 'voice-plugin': {
                const appServices = {
                    deployments: ['voice-plugin'],
                    services: [
                        'voice-plugin-service',
                    ],
                    statefulsets: [],
                };
                (0, delete_1.deleteApp)(appServices, flags.verbose);
                break;
            }
        }
    }
}
exports.default = DevRm;
DevRm.description = 'Delete Openline services';
DevRm.examples = [
    '<%= config.bin %> <%= command.id %>',
];
DevRm.flags = {
    all: core_1.Flags.boolean({ description: 'delete all Openline services and stop the Openline dev server' }),
    verbose: core_1.Flags.boolean({ char: 'v' }),
};
DevRm.args = [
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
            'voice',
            'kamailio',
            'asterisk',
            'voice-plugin',
        ],
    },
];
