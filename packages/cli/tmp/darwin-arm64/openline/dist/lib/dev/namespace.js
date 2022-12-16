"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installNamespace = exports.namespaceCheck = void 0;
const node_process_1 = require("node:process");
const shell = require("shelljs");
const dev_1 = require("../../config/dev");
const logs_1 = require("../logs");
const config = (0, dev_1.getConfig)();
function namespaceCheck() {
    const NAMESPACE = config.namespace.name;
    return (shell.exec(`kubectl get ns ${NAMESPACE}`, { silent: true }).code === 0);
}
exports.namespaceCheck = namespaceCheck;
function installNamespace(verbose, location = config.setupDir) {
    if (namespaceCheck())
        return true;
    const NAMESPACE_PATH = location + config.namespace.file;
    const kubeCreateNamespace = `kubectl create -f ${NAMESPACE_PATH}`;
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', kubeCreateNamespace);
    const ns = shell.exec(kubeCreateNamespace, { silent: !verbose });
    if (ns.code !== 0) {
        (0, logs_1.logTerminal)('ERROR', ns.stderr);
        (0, node_process_1.exit)(1);
    }
    return true;
}
exports.installNamespace = installNamespace;
