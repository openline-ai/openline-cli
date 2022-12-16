"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uninstallPostgresql = exports.provisionPostgresql = exports.installPostgresql = void 0;
const shell = require("shelljs");
const dev_1 = require("../../config/dev");
const logs_1 = require("../logs");
const node_process_1 = require("node:process");
const config = (0, dev_1.getConfig)();
const NAMESPACE = config.namespace.name;
const POSTGRESQL_SERVICE = 'customer-db-postgresql';
const PERSISTENT_VOLUME = 'customer-db-postgresql';
const PERSISTENT_VOLUME_CLAIM = 'customer-db-postgresql-claim';
function postgresqlServiceCheck() {
    return (shell.exec(`kubectl get service ${POSTGRESQL_SERVICE} -n ${NAMESPACE}`, { silent: true }).code === 0);
}
function postgresqlPersistentVolumeCheck() {
    return (shell.exec(`kubectl get pv ${PERSISTENT_VOLUME} -n ${NAMESPACE}`, { silent: true }).code === 0);
}
function postgresqlPersistentVolumeClaimCheck() {
    return (shell.exec(`kubectl get pvc ${PERSISTENT_VOLUME_CLAIM} -n ${NAMESPACE}`, { silent: true }).code === 0);
}
function installPostgresql(verbose, location = config.setupDir) {
    if (!setupPersistentVolume(verbose, location))
        return false;
    if (!setupPersistentVolumeClaim(verbose, location))
        return false;
    if (!deployPostgresql(verbose, location))
        return false;
    return true;
}
exports.installPostgresql = installPostgresql;
function setupPersistentVolume(verbose, location = config.setupDir) {
    if (postgresqlPersistentVolumeCheck())
        return true;
    const PERSISTENT_VOLUME_PATH = location + config.customerOs.postgresqlPersistentVolume;
    const kubePV = `kubectl apply -f ${PERSISTENT_VOLUME_PATH} --namespace ${NAMESPACE}`;
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', kubePV);
    const pv = shell.exec(kubePV, { silent: !verbose });
    if (pv.code !== 0) {
        (0, logs_1.logTerminal)('ERROR', pv.stderr, 'dev:postgres:setupPersistentVolume');
        (0, node_process_1.exit)(1);
    }
    return true;
}
function setupPersistentVolumeClaim(verbose, location = config.setupDir) {
    if (postgresqlPersistentVolumeClaimCheck())
        return true;
    const PERSISTENT_VOLUME_CLAIM_PATH = location + config.customerOs.postgresqlPersistentVolumeClaim;
    const kubePVC = `kubectl apply -f ${PERSISTENT_VOLUME_CLAIM_PATH} --namespace ${NAMESPACE}`;
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', kubePVC);
    const pvc = shell.exec(kubePVC, { silent: !verbose });
    if (pvc.code !== 0) {
        (0, logs_1.logTerminal)('ERROR', pvc.stderr, 'dev:postgres:setupPersistentVolumeClaim');
        (0, node_process_1.exit)(1);
    }
    return true;
}
function deployPostgresql(verbose, location = config.setupDir) {
    if (postgresqlServiceCheck())
        return true;
    const HELM_VALUES_PATH = location + config.customerOs.postgresqlHelmValues;
    const helmAdd = 'helm repo add bitnami https://charts.bitnami.com/bitnami';
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', helmAdd);
    shell.exec(helmAdd, { silent: true });
    const helmInstall = `helm install --values ${HELM_VALUES_PATH} ${POSTGRESQL_SERVICE} bitnami/postgresql --namespace ${NAMESPACE}`;
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', helmInstall);
    const postgresql = shell.exec(helmInstall, { silent: !verbose });
    if (postgresql.code !== 0) {
        (0, logs_1.logTerminal)('ERROR', postgresql.stderr);
        (0, node_process_1.exit)(1);
    }
    return true;
}
function provisionPostgresql(verbose, location = config.setupDir) {
    const sqlUser = 'openline';
    const sqlDb = 'openline';
    const sqlPw = 'password';
    const POSTGRESQL_DB_SETUP = location + config.customerOs.postgresqlSetup;
    let ms = '';
    let retry = 1;
    const maxAttempts = config.server.timeOuts / 5;
    while (ms === '') {
        if (retry < maxAttempts) {
            if (verbose)
                (0, logs_1.logTerminal)('INFO', `postgreSQL database starting up, please wait... ${retry}/${maxAttempts}`);
            shell.exec('sleep 2');
            ms = shell.exec(`kubectl get pods -n ${NAMESPACE}|grep message-store-api|grep Running| cut -f1 -d ' '`, { silent: true }).stdout;
            retry++;
        }
        else {
            (0, logs_1.logTerminal)('ERROR', 'Provisioning postgreSQL timed out', 'dev:postgres:provisionPostresql');
            return false;
        }
    }
    let cosDb = '';
    while (cosDb === '') {
        if (retry < maxAttempts) {
            if (verbose)
                (0, logs_1.logTerminal)('INFO', `postgreSQL database starting up, please wait... ${retry}/${maxAttempts}`);
            shell.exec('sleep 2');
            cosDb = shell.exec(`kubectl get pods -n ${NAMESPACE}|grep ${POSTGRESQL_SERVICE}|grep Running| cut -f1 -d ' '`, { silent: true }).stdout;
            retry++;
        }
        else {
            (0, logs_1.logTerminal)('ERROR', 'Provisioning postgreSQL timed out', 'dev:postgres:provisionPostresql');
            return false;
        }
    }
    cosDb = cosDb.slice(0, -1);
    if (verbose)
        (0, logs_1.logTerminal)('INFO', `connecting to ${cosDb} pod`);
    let provision = '';
    while (provision === '') {
        if (retry < maxAttempts) {
            if (verbose)
                (0, logs_1.logTerminal)('INFO', `attempting to provision message store db, please wait... ${retry}/${maxAttempts}`);
            shell.exec('sleep 2');
            provision = shell.exec(`echo ${POSTGRESQL_DB_SETUP}|xargs cat|kubectl exec -n ${NAMESPACE} -i ${cosDb} -- /bin/bash -c "PGPASSWORD=${sqlPw} psql -U ${sqlUser} ${sqlDb}"`, { silent: true }).stdout;
            retry++;
        }
        else {
            (0, logs_1.logTerminal)('ERROR', 'Provisioning message store DB timed out', 'dev:postgres:provisionPostresql');
            return false;
        }
    }
    if (verbose)
        (0, logs_1.logTerminal)('SUCCESS', 'PostgreSQL database successfully provisioned');
    return true;
}
exports.provisionPostgresql = provisionPostgresql;
function uninstallPostgresql(verbose) {
    const helmUninstall = `helm uninstall ${POSTGRESQL_SERVICE} --namespace ${NAMESPACE}`;
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', helmUninstall);
    const result = shell.exec(helmUninstall, { silent: !verbose });
    if (result.code === 0) {
        (0, logs_1.logTerminal)('SUCCESS', 'PostgreSQL successfully uninstalled');
    }
    else {
        (0, logs_1.logTerminal)('ERROR', result.stderr, 'dev:postgres:uninstallPostgresql');
        return false;
    }
    return true;
}
exports.uninstallPostgresql = uninstallPostgresql;
