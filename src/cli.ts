#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');
const shell = require('shelljs')

import * as appInstall from './install';

clear();
console.log(
    chalk.blue(
        figlet.textSync('Openline CLI', { horizontalLayout: 'full'})
    )
);

console.log(' ');
console.log(' ');

program
    .name('Openline CLI')
    .version('0.0.1')
    .description('CLI for the Openline ecosystem')
    .option('-i, --install <app name>', 'install an Openline application')
    .option('-r, --run <app name>', 'run an Openline application')
    .option('--dev', 'Setup local development environment')

program.parse(process.argv);

const options = program.opts();
if (options.debug) {
    console.log(options);
    console.log('');
};

if(options.install) {
    let app = options.install;
    if(app == 'website') {
        appInstall.installWebsite()
    };
    //console.log(` Install ${options.install}`);
};

if(options.run) console.log(`Run ${options.run}`);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}