"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopColima = exports.deleteAll = exports.startColima = exports.contextCheck = exports.runningCheck = void 0;
const node_process_1 = require("node:process");
const shell = require("shelljs");
const dev_1 = require("../../config/dev");
const logs_1 = require("../logs");
function runningCheck() {
    return (shell.exec('colima status', { silent: true }).code === 0);
}
exports.runningCheck = runningCheck;
function contextCheck(verbose) {
    if (verbose)
        (0, logs_1.logTerminal)('INFO', 'checking kubernetes contexts...');
    const check = 'kubectl config get-contexts | grep "*"';
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', check);
    const context = shell.exec(check, { silent: true }).stdout;
    if (context.includes('colima'))
        return true;
    if (verbose)
        (0, logs_1.logTerminal)('INFO', 'setting kubernetes context to colima...');
    const useContext = 'kubectl config use-context colima';
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', useContext);
    const update = shell.exec(useContext, { silent: true });
    if (update.code !== 0) {
        // this creates the colima context in ~./kube/config if it doesn't exist
        if (verbose)
            (0, logs_1.logTerminal)('INFO', 'creating kubernetes context for colima');
        const createContext = 'colima kubernetes reset';
        if (verbose)
            (0, logs_1.logTerminal)('EXEC', createContext);
        if (shell.exec(createContext, { silent: !verbose }).code === 0) {
            if (verbose)
                (0, logs_1.logTerminal)('EXEC', useContext);
            return shell.exec(useContext, { silent: true }).code === 0;
        }
    }
    return true;
}
exports.contextCheck = contextCheck;
function startColima(verbose) {
    const config = (0, dev_1.getConfig)();
    // check to see if Colima is already running
    const isRunning = runningCheck();
    if (isRunning) {
        // if running, checks to make sure context hasn't changed (still colima)
        const isContext = contextCheck(verbose);
        if (isContext)
            return true;
    }
    // start up Colima with Openline configurations
    contextCheck(false);
    const CPU = config.server.cpu;
    const MEMORY = config.server.memory;
    const DISK = config.server.disk;
    const colimaStart = `colima start --with-kubernetes --cpu ${CPU} --memory ${MEMORY} --disk ${DISK}`;
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', colimaStart);
    const start = shell.exec(colimaStart, { silent: true });
    if (start.code !== 0) {
        (0, logs_1.logTerminal)('ERROR', start.stderr, 'dev:colima:startColima');
        (0, node_process_1.exit)(1);
    }
    return contextCheck(verbose);
}
exports.startColima = startColima;
function deleteAll(verbose) {
    const cmd = 'colima kubernetes reset';
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', cmd);
    const reset = shell.exec(cmd, { silent: true });
    if (reset.code === 0) {
        (0, logs_1.logTerminal)('SUCCESS', 'Openline dev server has been deleted');
        (0, logs_1.logTerminal)('INFO', 'to stop the dev server, run => openline dev stop');
    }
    else {
        (0, logs_1.logTerminal)('ERROR', reset.stderr, 'dev:delete:deleteAll');
        return false;
    }
    return true;
}
exports.deleteAll = deleteAll;
function stopColima(verbose) {
    (0, logs_1.logTerminal)('INFO', '🦦 Saving current configuration...');
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', 'colima stop');
    const reset = shell.exec('colima stop', { silent: true });
    if (reset.code === 0) {
        (0, logs_1.logTerminal)('SUCCESS', 'Openline dev server stopped');
    }
    else {
        (0, logs_1.logTerminal)('ERROR', reset.stderr, 'dev:stop');
    }
}
exports.stopColima = stopColima;
