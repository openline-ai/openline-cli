"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingFusionAuth = exports.uninstallFusionAuth = exports.installFusionAuth = void 0;
const shell = require("shelljs");
const dev_1 = require("../../config/dev");
const deploy_1 = require("./deploy");
const logs_1 = require("../logs");
const node_process_1 = require("node:process");
const config = (0, dev_1.getConfig)();
const NAMESPACE = config.namespace.name;
const FUSIONAUTH_SERVICE = 'auth-fusionauth';
function fusionauthCheck() {
    return (shell.exec(`kubectl get service ${FUSIONAUTH_SERVICE} -n ${NAMESPACE}`, { silent: true }).code === 0);
}
function hostsCheck() {
    const check = shell.exec(`grep ${FUSIONAUTH_SERVICE}.openline.svc.cluster.local /etc/hosts`, { silent: true }).stdout;
    if (check === '')
        return false;
    return true;
}
function addHosts(verbose) {
    if (hostsCheck())
        return true;
    const cmd = `sudo bash -c "echo 127.0.0.1 ${FUSIONAUTH_SERVICE}.openline.svc.cluster.local >> /etc/hosts"`;
    (0, logs_1.logTerminal)('INFO', 'updating host file with fusionauth configuration');
    (0, logs_1.logTerminal)('INFO', 'this requires sudo permissions and is required for fusionauth to work');
    (0, logs_1.logTerminal)('INFO', 'if granted, the following command will execute...');
    (0, logs_1.logTerminal)('INFO', cmd);
    return (shell.exec(cmd, { silent: !verbose }).code === 0);
}
function installFusionAuth(verbose, location = config.setupDir) {
    if (fusionauthCheck())
        return true;
    const HELM_VALUES_PATH = location + config.customerOs.fusionauthHelmValues;
    const LOADBALANCER_PATH = location + config.customerOs.fusionauthLoadbalancer;
    const helmAdd = 'helm repo add fusionauth https://fusionauth.github.io/charts';
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', helmAdd);
    shell.exec(helmAdd, { silent: true });
    const helmInstall = `helm install ${FUSIONAUTH_SERVICE} fusionauth/fusionauth -f ${HELM_VALUES_PATH} --namespace ${NAMESPACE}`;
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', helmInstall);
    const fa = shell.exec(helmInstall, { silent: !verbose });
    if (fa.code !== 0) {
        (0, logs_1.logTerminal)('ERROR', fa.stderr);
        (0, node_process_1.exit)(1);
    }
    if (!(0, deploy_1.deployLoadbalancer)(LOADBALANCER_PATH, verbose))
        return false;
    if (!addHosts(verbose))
        return false;
    (0, logs_1.logTerminal)('SUCCESS', 'auth successfully installed');
    return true;
}
exports.installFusionAuth = installFusionAuth;
function uninstallFusionAuth(verbose) {
    const helmUninstall = `helm uninstall ${FUSIONAUTH_SERVICE} --namespace ${NAMESPACE}`;
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', helmUninstall);
    const result = shell.exec(helmUninstall, { silent: true });
    if (result.code === 0) {
        (0, logs_1.logTerminal)('SUCCESS', 'auth deployment successfully uninstalled');
    }
    else {
        (0, logs_1.logTerminal)('ERROR', result.stderr, 'dev:auth:uninstallFusionAuth');
        return false;
    }
    return true;
}
exports.uninstallFusionAuth = uninstallFusionAuth;
function pingFusionAuth() {
    return shell.exec('curl --max-time 2 localhost:9011/health', { silent: true }).code === 0;
}
exports.pingFusionAuth = pingFusionAuth;
