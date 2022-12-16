"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneRepo = void 0;
const logs_1 = require("../../lib/logs");
const shell = require("shelljs");
// eslint-disable-next-line max-params
function cloneRepo(repo, verbose, location, branch, quiet) {
    let cmd = `git clone ${repo}`;
    if (location) {
        cmd += ' ' + location;
    }
    if (branch) {
        cmd += ` -b ${branch}`;
    }
    if (quiet) {
        cmd += ' -q';
    }
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', cmd);
    const clone = shell.exec(cmd, { silent: false });
    if (clone.code !== 0)
        (0, logs_1.logTerminal)('ERROR', clone.stderr);
    if (clone.code === 0 && !quiet)
        (0, logs_1.logTerminal)('SUCCESS', 'a local copy of the codebase has been created.  Enjoy!');
}
exports.cloneRepo = cloneRepo;
