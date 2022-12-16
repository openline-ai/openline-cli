"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPortForward = exports.stopK3d = exports.deleteAll = exports.startk3d = exports.contextCheck = exports.runningCheck = void 0;
const node_process_1 = require("node:process");
const shell = require("shelljs");
const logs_1 = require("../logs");
function runningCheck() {
    return (shell.exec('k3d node list', { silent: true }).stdout.includes('running'));
}
exports.runningCheck = runningCheck;
function contextCheck(verbose) {
    if (verbose)
        (0, logs_1.logTerminal)('INFO', 'checking kubernetes contexts...');
    const check = 'kubectl config get-contexts | grep "*"';
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', check);
    const context = shell.exec(check, { silent: true }).stdout;
    if (context.includes('k3d'))
        return true;
    if (verbose)
        (0, logs_1.logTerminal)('INFO', 'setting kubernetes context to k3d-development...');
    const useContext = 'kubectl config use-context k3d-development';
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', useContext);
    const update = shell.exec(useContext, { silent: true });
    if (update.code !== 0) {
        // this creates the colima context in ~./kube/config if it doesn't exist
        if (verbose)
            (0, logs_1.logTerminal)('INFO', 'creating kubernetes context for k3d-developmet');
        const createContext = 'k3d kubeconfig merge development --kubeconfig-switch-context';
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
function startk3d(verbose) {
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
    const check = 'k3d cluster list';
    let start;
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', check);
    const context = shell.exec(check, { silent: true }).stdout;
    if (context.includes('development')) {
        const k3dStart = 'k3d cluster start development';
        if (verbose)
            (0, logs_1.logTerminal)('EXEC', k3dStart);
        start = shell.exec(k3dStart, { silent: true });
    }
    else {
        const k3dStart = 'k3d cluster create development';
        if (verbose)
            (0, logs_1.logTerminal)('EXEC', k3dStart);
        start = shell.exec(k3dStart, { silent: true });
    }
    if (start.code !== 0) {
        (0, logs_1.logTerminal)('ERROR', start.stderr, 'dev:k3d:startK3d');
        (0, node_process_1.exit)(1);
    }
    return contextCheck(verbose);
}
exports.startk3d = startk3d;
function deleteAll(verbose) {
    const cmd = 'k3d cluster delete development';
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
function stopK3d(verbose) {
    (0, logs_1.logTerminal)('INFO', '🦦 Saving current configuration...');
    const stopCommand = 'k3d cluster stop development';
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', stopCommand);
    const reset = shell.exec(stopCommand, { silent: true });
    if (reset.code === 0) {
        (0, logs_1.logTerminal)('SUCCESS', 'Openline dev server stopped');
    }
    else {
        (0, logs_1.logTerminal)('ERROR', reset.stderr, 'dev:stop');
    }
}
exports.stopK3d = stopK3d;
function createPortForward(verbose, port, protocol) {
    const forwardString = protocol ? `${port}:${port}/${protocol}@loadbalancer` : `${port}:${port}@loadbalancer`;
    const filterString = protocol ? `:${port}->${port}/${protocol}` : `:${port}->${port}/tcp`;
    const existingPorts = shell.exec('docker ps |grep k3d-development-serverlb', { silent: true }).stdout;
    const portAlreadExists = existingPorts.includes(filterString);
    if (portAlreadExists) {
        (0, logs_1.logTerminal)('INFO', `${filterString} mapping already exists, skipping`);
        return true;
    }
    const addPortCmd = `k3d cluster edit development --port-add ${forwardString}`;
    const addPort = shell.exec(addPortCmd, { silent: !verbose });
    if (addPort.code !== 0) {
        (0, logs_1.logTerminal)('ERROR', addPort.stderr, 'dev:deploy:deployImage');
        return false;
    }
    return true;
}
exports.createPortForward = createPortForward;
