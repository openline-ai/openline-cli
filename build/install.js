"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installWebsite = void 0;
const shell = require('shelljs');
function installWebsite() {
    if (!shell.which('git')) {
        shell.echo('Sorry, this script requires git');
        shell.exit(1);
    }
    shell.echo('installing website...');
    const path = '/code/openline-website';
    shell.mkdir(path);
    shell.cd(path);
    shell.exec('git clone https://github.com/openline-ai/openline.ai.git');
    shell.exec('yarn install');
    shell.exec('yarn start');
}
exports.installWebsite = installWebsite;
;
