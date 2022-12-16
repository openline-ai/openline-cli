"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const dev_1 = require("../../config/dev");
const clone_repo_1 = require("../../lib/clone/clone-repo");
class DevClone extends core_1.Command {
    async run() {
        const { args, flags } = await this.parse(DevClone);
        const config = (0, dev_1.getConfig)();
        const app = args.app;
        switch (app) {
            case 'contacts':
                (0, clone_repo_1.cloneRepo)(config.contacts.repo, flags.verbose, args.location, flags.branch);
                break;
            case 'cli':
                (0, clone_repo_1.cloneRepo)(config.cli.repo, flags.verbose, args.location, flags.branch);
                break;
            case 'customer-os':
                (0, clone_repo_1.cloneRepo)(config.customerOs.repo, flags.verbose, args.location, flags.branch);
                break;
            case 'oasis':
                (0, clone_repo_1.cloneRepo)(config.oasis.repo, flags.verbose, args.location, flags.branch);
                break;
            case 'voice':
                (0, clone_repo_1.cloneRepo)(config.voice.repo, flags.verbose, args.location, flags.branch);
                break;
            case 'webchat':
                (0, clone_repo_1.cloneRepo)(config.webchat.repo, flags.verbose, args.location, flags.branch);
                break;
            case 'website':
                (0, clone_repo_1.cloneRepo)(config.website.repo, flags.verbose, args.location, flags.branch);
                break;
        }
    }
}
exports.default = DevClone;
DevClone.description = 'Create a local copy of an Openline code repository';
DevClone.examples = [
    '<%= config.bin %> <%= command.id %>',
];
DevClone.aliases = ['dev:clc'];
DevClone.flags = {
    branch: core_1.Flags.string({
        char: 'b',
        description: 'the name of the branch you would like to clone',
    }),
    verbose: core_1.Flags.boolean({
        char: 'v',
    }),
};
DevClone.args = [
    {
        name: 'app',
        required: true,
        description: 'the openline codebase you want to copy locally',
        options: [
            'contacts',
            'cli',
            'customer-os',
            'oasis',
            'voice',
            'webchat',
            'website',
        ],
    },
    {
        name: 'location',
        description: 'the location on your computer where you would like to put the cloned codebase',
    },
];
