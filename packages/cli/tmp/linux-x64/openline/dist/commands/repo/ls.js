"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const repo_1 = require("../../config/repo");
const colors = require("colors"); // eslint-disable-line no-restricted-imports
const Table = require('cli-table'); // eslint-disable-line unicorn/prefer-module
class RepoLs extends core_1.Command {
    async run() {
        // const {args, flags} = await this.parse(RepoLs)
        const repos = (0, repo_1.getRepos)();
        const table = new Table({
            head: [colors.cyan.bold('Project'), colors.cyan.bold('Github URL')],
        });
        table.push(['cli', repos.baseUrl + repos.cli], ['contacts', repos.baseUrl + repos.contacts], ['customer-os', repos.baseUrl + repos.customerOs], ['hubspot-integration', repos.baseUrl + repos.hubspot], ['oasis', repos.baseUrl + repos.oasis], ['ui-kit', repos.baseUrl + repos.uiKit], ['voice', repos.baseUrl + repos.voice], ['webchat', repos.baseUrl + repos.webchat], ['website', repos.baseUrl + repos.website], ['zendesk-integration', repos.baseUrl + repos.zendesk]);
        console.log(table.toString());
    }
}
exports.default = RepoLs;
RepoLs.description = 'Get a list of all Openline projects accepting community contributions';
RepoLs.examples = [
    '<%= config.bin %> <%= command.id %>',
];
RepoLs.flags = {};
RepoLs.args = [];
