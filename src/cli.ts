#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');

clear();
console.log(
    chalk.blue(
        figlet.textSync('Openline CLI', { horizontalLayout: 'full'})
    )
);

