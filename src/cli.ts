#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

yargs(hideBin(process.argv))
    // use the commands directory to scaffold
    .commandDir('commands')
    // enable strict mode
    .strict()
    // useful aliases
    .alias({ 
        h: 'help'
    })
    .argv;