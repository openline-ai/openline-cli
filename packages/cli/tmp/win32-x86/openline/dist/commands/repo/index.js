"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const repo_1 = require("../../config/repo");
const colors = require("colors"); // eslint-disable-line no-restricted-imports
const Table = require('cli-table'); // eslint-disable-line unicorn/prefer-module
class Repo extends core_1.Command {
    async run() {
        const { args } = await this.parse(Repo);
        const repos = (0, repo_1.getRepos)();
        const table = new Table({
            head: [colors.cyan.bold('Project'), colors.cyan.bold('Github URL')],
        });
        const project = args.project.toLowerCase();
        switch (project) {
            case 'cli':
                table.push(['cli', repos.baseUrl + repos.cli]);
                console.log(table.toString());
                break;
            case 'contacts':
                table.push(['contacts', repos.baseUrl + repos.contacts]);
                console.log(table.toString());
                break;
            case 'customer-os':
                table.push(['customer-os', repos.baseUrl + repos.customerOs]);
                console.log(table.toString());
                break;
            case 'hubspot-integration':
                table.push(['hubspot-integration', repos.baseUrl + repos.hubspot]);
                console.log(table.toString());
                break;
            case 'oasis':
                table.push(['oasis', repos.baseUrl + repos.oasis]);
                console.log(table.toString());
                break;
            case 'ui-kit':
                table.push(['ui-kit', repos.baseUrl + repos.uiKit]);
                console.log(table.toString());
                break;
            case 'voice':
                table.push(['voice', repos.baseUrl + repos.voice]);
                console.log(table.toString());
                break;
            case 'website':
                table.push(['website', repos.baseUrl + repos.website]);
                console.log(table.toString());
                break;
            case 'web-chat':
                table.push(['webchat', repos.baseUrl + repos.webchat]);
                console.log(table.toString());
                break;
            case 'zendesk-integration':
                table.push(['zendesk-integration', repos.baseUrl + repos.zendesk]);
                console.log(table.toString());
                break;
        }
    }
}
exports.default = Repo;
Repo.description = 'Get the GitHub repo for an Openline project';
Repo.examples = [
    '<%= config.bin %> <%= command.id %>',
];
Repo.args = [
    {
        name: 'project',
        required: true,
        description: 'the Openline project you would like to view',
        options: [
            'cli',
            'contacts',
            'customer-os',
            'hubspot-integration',
            'oasis',
            'ui-kit',
            'voice',
            'web-chat',
            'website',
            'zendesk-integration',
        ],
    },
];
