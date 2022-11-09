#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');
const shell = require('shelljs');
const appInstall = __importStar(require("./install"));
clear();
console.log(chalk.blue(figlet.textSync('Openline CLI', { horizontalLayout: 'full' })));
console.log(' ');
console.log(' ');
program
    .name('Openline CLI')
    .version('0.0.1')
    .description('CLI for the Openline ecosystem')
    .option('-i, --install <app name>', 'install an Openline application')
    .option('-r, --run <app name>', 'run an Openline application');
program.parse(process.argv);
const options = program.opts();
if (options.debug) {
    console.log(options);
    console.log('');
}
;
if (options.install) {
    let app = options.install;
    if (app == 'website') {
        appInstall.installWebsite();
    }
    ;
    //console.log(` Install ${options.install}`);
}
;
if (options.run)
    console.log(`Run ${options.run}`);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
