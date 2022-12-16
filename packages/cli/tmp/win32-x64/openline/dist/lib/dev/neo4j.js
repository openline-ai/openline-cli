"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uninstallNeo4j = exports.provisionNeo4j = exports.installNeo4j = void 0;
const shell = require("shelljs");
const dev_1 = require("../../config/dev");
const logs_1 = require("../logs");
const node_process_1 = require("node:process");
const config = (0, dev_1.getConfig)();
const NAMESPACE = config.namespace.name;
const NEO4J_SERVICE = 'customer-db-neo4j';
const NEO4J_POD = 'customer-db-neo4j-0';
function neo4jCheck() {
    return (shell.exec(`kubectl get service ${NEO4J_SERVICE} -n ${NAMESPACE}`, { silent: true }).code === 0);
}
function installNeo4j(verbose, location = config.setupDir) {
    if (neo4jCheck())
        return true;
    const HELM_VALUES_PATH = location + config.customerOs.neo4jHelmValues;
    const helmAdd = 'helm repo add neo4j https://helm.neo4j.com/neo4j';
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', helmAdd);
    shell.exec(helmAdd, { silent: true });
    const helmInstall = `helm install ${NEO4J_SERVICE} neo4j/neo4j-standalone --set volumes.data.mode=defaultStorageClass -f ${HELM_VALUES_PATH} --namespace ${NAMESPACE}`;
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', helmInstall);
    const neoInstall = shell.exec(helmInstall, { silent: !verbose });
    if (neoInstall.code !== 0) {
        (0, logs_1.logTerminal)('ERROR', neoInstall.stderr, 'dev:neo4j:installNeo4j');
        (0, node_process_1.exit)(1);
    }
    return true;
}
exports.installNeo4j = installNeo4j;
function provisionNeo4j(verbose, location = config.setupDir) {
    let neo = '';
    let retry = 1;
    const maxAttempts = config.server.timeOuts / 2;
    const NEO4J_CYPHER = location + config.customerOs.neo4jCypher;
    while (neo === '') {
        if (retry < maxAttempts) {
            if (verbose)
                (0, logs_1.logTerminal)('INFO', `Neo4j starting up, please wait... ${retry}/${maxAttempts}`);
            shell.exec('sleep 2');
            neo = shell.exec(`kubectl get pods -n ${NAMESPACE}|grep ${NEO4J_SERVICE}|grep Running|cut -f1 -d ' '`, { silent: true }).stdout;
            retry++;
        }
        else {
            (0, logs_1.logTerminal)('ERROR', 'Provisioning Neo4j timed out', 'dev:neo4j:provionNeo4j');
            return false;
        }
    }
    let started = '';
    while (!started.includes('password')) {
        if (retry < maxAttempts) {
            if (verbose)
                (0, logs_1.logTerminal)('INFO', `Neo4j initializing, please wait... ${retry}/${maxAttempts}`);
            shell.exec('sleep 2');
            started = shell.exec(`kubectl logs -n ${NAMESPACE} ${neo}`, { silent: true }).stdout;
            retry++;
        }
        else {
            (0, logs_1.logTerminal)('ERROR', 'Provisioning Neo4j timed out', 'dev:neo4j:provionNeo4j');
            return false;
        }
    }
    const version = shell.exec(`kubectl describe pod ${NEO4J_POD} -n ${NAMESPACE} | grep HELM_NEO4J_VERSION | tr -s ' ' | cut -d ' ' -f 3`, { silent: true }).stdout.trimEnd();
    if (verbose)
        (0, logs_1.logTerminal)('INFO', `Neo4j version detected... ${version}`);
    let neoOutput = [];
    do {
        const neoOutputFull = shell.exec(`cat ${NEO4J_CYPHER} |kubectl run --rm -i --namespace ${NAMESPACE} --image "neo4j:${version}" cypher-shell  -- bash -c 'NEO4J_PASSWORD=StrongLocalPa\\$\\$ cypher-shell -a neo4j://${NEO4J_SERVICE}.openline.svc.cluster.local:7687 -u neo4j --non-interactive'`, { silent: true }).stderr.split(/\r?\n/);
        neoOutput = neoOutputFull.filter(function (line) {
            return !(line.includes('see a command prompt') || line === '');
        });
        if (neoOutput.length > 0) {
            retry++;
            shell.exec(`kubectl delete pod cypher-shell -n ${NAMESPACE}`, { silent: true });
            shell.exec('sleep 2');
            if (verbose)
                (0, logs_1.logTerminal)('INFO', `Neo4j provisioning attempt failed reason = ${JSON.stringify(neoOutput)} retrying... ${retry}/${maxAttempts}`);
        }
    } while (neoOutput.length > 0);
    (0, logs_1.logTerminal)('SUCCESS', 'neo4j database successfully provisioned');
    return true;
}
exports.provisionNeo4j = provisionNeo4j;
function uninstallNeo4j(verbose) {
    const helmUninstall = `helm uninstall ${NEO4J_SERVICE} --namespace ${NAMESPACE}`;
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', helmUninstall);
    const result = shell.exec(helmUninstall, { silent: true });
    if (result.code === 0) {
        (0, logs_1.logTerminal)('SUCCESS', 'Neo4j successfully uninstalled');
    }
    else {
        (0, logs_1.logTerminal)('ERROR', result.stderr, 'dev:neo4j:uninstallNeo4j');
        return false;
    }
    return true;
}
exports.uninstallNeo4j = uninstallNeo4j;
