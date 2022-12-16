"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const figlet = require("figlet");
const octokit_1 = require("octokit");
const dotenv = require("dotenv");
//import { url } from 'inspector'
dotenv.config();
class Issues extends core_1.Command {
    async run() {
        const { args, flags } = await this.parse(Issues);
        let token = process.env.GITHUB_TOKEN;
        if (flags.token) {
            token = flags.token;
        }
        // return a list of issues assigned to me across all repos
        const octokit = new octokit_1.Octokit({
            auth: token,
        });
        let resp = await octokit.request('GET /orgs/{org}/issues', {
            org: 'openline-ai',
        });
        console.log('');
        console.log(figlet.textSync('My issues...'));
        console.log('');
        let issueCount = 0;
        resp.data.forEach(issue => {
            var _a, _b;
            let labels = [];
            if (issue.labels) {
                issue.labels.forEach((l) => {
                    labels.push(l.name);
                });
            }
            if (Object.keys(flags).length == 0) {
                if (((_a = issue.milestone) === null || _a === void 0 ? void 0 : _a.title) || labels.includes('bug')) {
                    printIssue(issue, labels);
                    issueCount++;
                }
            }
            else if (flags.milestone && ((_b = issue.milestone) === null || _b === void 0 ? void 0 : _b.title)) {
                printIssue(issue, labels);
                issueCount++;
            }
            else if (flags.bug && labels.includes('bug')) {
                printIssue(issue, labels);
                issueCount++;
            }
            else if (flags.all) {
                printIssue(issue, labels);
                issueCount++;
            }
        });
        console.log('Your open issues: ', issueCount);
        // create a new issue
        if (flags.new) {
            console.log('');
            console.log(figlet.textSync('Log a new issue...'));
            console.log('New issue against ', flags.repo);
        }
    }
}
exports.default = Issues;
Issues.description = 'Interact with GitHub issues for openline-ai.  If no flags are set, command will return a list of all open issues assigned to you with a milestone or bug tag.';
Issues.examples = [
    'openline issues',
    'openline issues -all',
    'openline issues -b',
    'openline issues -new',
];
Issues.flags = {
    all: core_1.Flags.boolean({ char: 'a', description: 'return all issues assigned to me' }),
    bug: core_1.Flags.boolean({ char: 'b', description: 'return all bugs assigned to me' }),
    milestone: core_1.Flags.boolean({ char: 'm', description: 'return all issues tageed to a milestone assigned to me' }),
    new: core_1.Flags.boolean({ char: 'n', summary: 'create new github issue', description: 'create a new github issue against an openline repo' }),
    token: core_1.Flags.string({ char: 't', summary: 'github auth token', description: 'overrides the token set in config' }),
    //repo: Flags.string({char: 'r', summary: 'openline-ai repo', description: 'the openline repo that cooresponds with the openline product', options: ['cli', 'customer-os', 'contacts', 'oasis', 'website']}),
};
Issues.args = [];
// Print issues
function printIssue(issue, labels) {
    var _a, _b;
    let url = issue.html_url;
    let issueNumber = issue.number;
    let issueId = issue.id;
    let title = issue.title;
    let milestone = (_a = issue.milestone) === null || _a === void 0 ? void 0 : _a.title;
    let created = issue.created_at;
    let repository = (_b = issue.repository) === null || _b === void 0 ? void 0 : _b.name;
    console.log(repository, ' #', issueNumber, ' ', title, ' - ', issueId);
    console.log(url);
    console.log('Labels: ', labels);
    console.log('Milestones: ', milestone);
    console.log('Created: ', created);
    console.log('');
}
