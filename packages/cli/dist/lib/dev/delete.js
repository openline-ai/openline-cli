"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAll = exports.deleteApp = void 0;
const shell = require("shelljs");
const logs_1 = require("../logs");
const colima = require("./colima");
const k3d = require("./k3d");
const dependencies_1 = require("../dependencies");
function deleteApp(apps, verbose) {
    const NAMESPACE = 'openline';
    for (const deployment of apps.deployments) {
        const kubeDeleteDeployment = `kubectl delete deployments ${deployment} -n ${NAMESPACE}`;
        if (verbose)
            (0, logs_1.logTerminal)('EXEC', kubeDeleteDeployment);
        const result = shell.exec(kubeDeleteDeployment, { silent: true });
        if (result.code === 0) {
            (0, logs_1.logTerminal)('SUCCESS', `${deployment} deployment successfully uninstalled`);
        }
        else {
            (0, logs_1.logTerminal)('ERROR', result.stderr, 'dev:delete:deleteApp');
        }
    }
    for (const statefulset of apps.statefulsets) {
        const kubeDeleteStatefulset = `kubectl delete statefulset ${statefulset} -n ${NAMESPACE}`;
        if (verbose)
            (0, logs_1.logTerminal)('EXEC', kubeDeleteStatefulset);
        const result = shell.exec(kubeDeleteStatefulset, { silent: true });
        if (result.code === 0) {
            (0, logs_1.logTerminal)('SUCCESS', `${statefulset} successfully uninstalled`);
        }
        else {
            (0, logs_1.logTerminal)('ERROR', result.stderr, 'dev:delete:deleteApp');
        }
    }
    for (const service of apps.services) {
        const kubeDeleteService = `kubectl delete service ${service} -n ${NAMESPACE}`;
        if (verbose)
            (0, logs_1.logTerminal)('EXEC', kubeDeleteService);
        const result = shell.exec(kubeDeleteService, { silent: true });
        if (result.code === 0) {
            (0, logs_1.logTerminal)('SUCCESS', `${service} successfully uninstalled`);
        }
        else {
            (0, logs_1.logTerminal)('ERROR', result.stderr, 'dev:delete:deleteApp');
        }
    }
    return true;
}
exports.deleteApp = deleteApp;
function deleteAll(verbose) {
    switch ((0, dependencies_1.getPlatform)()) {
        case 'mac':
            return colima.deleteAll(verbose);
        case 'linux':
            return k3d.deleteAll(verbose);
    }
    return false;
}
exports.deleteAll = deleteAll;
