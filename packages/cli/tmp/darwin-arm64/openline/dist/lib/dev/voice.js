"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingKamailio = exports.provisionPostgresql = exports.installVoicePlugin = exports.installAsterisk = exports.installKamailio = void 0;
const shell = require("shelljs");
const dev_1 = require("../../config/dev");
const deploy_1 = require("./deploy");
const build_image_1 = require("./build-image");
const logs_1 = require("../logs");
const config = (0, dev_1.getConfig)();
const NAMESPACE = config.namespace.name;
const KAMAILIO = 'kamailio-service';
const ASTERISK = 'asterisk';
const VOICE_PLUGIN = 'voice-plugin-service';
const POSTGRESQL_SERVICE = 'customer-db-postgresql';
function kamailioCheck() {
    return (shell.exec(`kubectl get service ${KAMAILIO} -n ${NAMESPACE}`, { silent: true }).code === 0);
}
function asteriskCheck() {
    return (shell.exec(`kubectl get service ${ASTERISK} -n ${NAMESPACE}`, { silent: true }).code === 0);
}
function voicePluginCheck() {
    return (shell.exec(`kubectl get service ${VOICE_PLUGIN} -n ${NAMESPACE}`, { silent: true }).code === 0);
}
function installKamailio(verbose, location = config.setupDir, imageVersion = 'latest') {
    if (kamailioCheck())
        return true;
    const DEPLOYMENT = location + config.voice.kamailio.Deployment;
    const SERVICE = location + config.voice.kamailio.Service;
    const LOADBALANCER = location + config.voice.kamailio.Loadbalancer;
    if (!provisionPostgresql(verbose, location)) {
        return false;
    }
    if (imageVersion.toLowerCase() !== 'latest') {
        const tag = (0, deploy_1.updateImageTag)([DEPLOYMENT], imageVersion);
        if (!tag)
            return false;
    }
    let image = config.voice.kamailio.Image + imageVersion;
    if (location !== config.setupDir) {
        // come back to this when Dockerfiles are standardized
        const buildPath = location + '/packages/server/kamailio';
        (0, build_image_1.buildLocalImage)(buildPath, buildPath, image, verbose);
        image = null;
    }
    const installConfig = {
        deployYaml: DEPLOYMENT,
        serviceYaml: SERVICE,
        loadbalancerYaml: LOADBALANCER,
    };
    const deploy = (0, deploy_1.deployImage)(image, installConfig, verbose);
    if (deploy === false)
        return false;
    (0, logs_1.logTerminal)('SUCCESS', 'kamailio successfully installed');
    return true;
}
exports.installKamailio = installKamailio;
function installAsterisk(verbose, location = config.setupDir, imageVersion = 'latest') {
    if (asteriskCheck())
        return true;
    const DEPLOYMENT = location + config.voice.asterisk.Deployment;
    const SERVICE = location + config.voice.asterisk.Service;
    if (imageVersion.toLowerCase() !== 'latest') {
        const tag = (0, deploy_1.updateImageTag)([DEPLOYMENT], imageVersion);
        if (!tag)
            return false;
    }
    let image = config.voice.asterisk.Image + imageVersion;
    if (location !== config.setupDir) {
        // come back to this when Dockerfiles are standardized
        const buildPath = location + '/packages/server/asterisk';
        (0, build_image_1.buildLocalImage)(buildPath, buildPath, image, verbose);
        image = null;
    }
    const installConfig = {
        deployYaml: DEPLOYMENT,
        serviceYaml: SERVICE,
    };
    const deploy = (0, deploy_1.deployImage)(image, installConfig, verbose);
    if (deploy === false)
        return false;
    (0, logs_1.logTerminal)('SUCCESS', 'asterisk successfully installed');
    return true;
}
exports.installAsterisk = installAsterisk;
function installVoicePlugin(verbose, location = config.setupDir, imageVersion = 'latest') {
    if (voicePluginCheck())
        return true;
    const DEPLOYMENT = location + config.voice.plugin.Deployment;
    const SERVICE = location + config.voice.plugin.Service;
    if (imageVersion.toLowerCase() !== 'latest') {
        const tag = (0, deploy_1.updateImageTag)([DEPLOYMENT], imageVersion);
        if (!tag)
            return false;
    }
    let image = config.voice.plugin.Image + imageVersion;
    if (location !== config.setupDir) {
        // come back to this when Dockerfiles are standardized
        const buildPath = location + '/packages/apps/voice-plugin';
        (0, build_image_1.buildLocalImage)(buildPath, buildPath, image, verbose);
        image = null;
    }
    const installConfig = {
        deployYaml: DEPLOYMENT,
        serviceYaml: SERVICE,
    };
    const deploy = (0, deploy_1.deployImage)(image, installConfig, verbose);
    if (deploy === false)
        return false;
    (0, logs_1.logTerminal)('SUCCESS', 'voice-plugin successfully installed');
    return true;
}
exports.installVoicePlugin = installVoicePlugin;
function provisionPostgresql(verbose, location = config.setupDir) {
    const sqlUser = 'openline';
    const sqlDb = 'openline';
    const sqlPw = 'password';
    const FILES = ['standard-create.sql', 'permissions-create.sql', 'carriers.sql'];
    let POSTGRESQL_DB_SETUP = '';
    // eslint-disable-next-line guard-for-in
    for (const i in FILES) {
        POSTGRESQL_DB_SETUP = POSTGRESQL_DB_SETUP + ' ' + location + '/packages/server/kamailio/sql/' + FILES[i];
    }
    let ms = '';
    let retry = 1;
    const maxAttempts = config.server.timeOuts / 5;
    while (ms === '') {
        if (retry < maxAttempts) {
            if (verbose)
                (0, logs_1.logTerminal)('INFO', `postgreSQL database starting up, please wait... ${retry}/${maxAttempts}`);
            ms = shell.exec(`kubectl get pods -n ${NAMESPACE}|grep message-store-api|grep Running| cut -f1 -d ' '`, { silent: true }).stdout;
            if (ms === '')
                shell.exec('sleep 2');
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
                (0, logs_1.logTerminal)('INFO', `attempting to provision voice db, please wait... ${retry}/${maxAttempts}`);
            shell.exec('sleep 2');
            provision = shell.exec(`echo ${POSTGRESQL_DB_SETUP}|xargs cat|kubectl exec -n ${NAMESPACE} -i ${cosDb} -- /bin/bash -c "PGPASSWORD=${sqlPw} psql -U ${sqlUser} ${sqlDb}"`, { silent: true }).stdout;
            retry++;
        }
        else {
            (0, logs_1.logTerminal)('ERROR', 'Provisioning voice DB timed out', 'dev:postgres:provisionPostresql');
            return false;
        }
    }
    if (verbose)
        (0, logs_1.logTerminal)('SUCCESS', 'PostgreSQL database successfully provisioned');
    return true;
}
exports.provisionPostgresql = provisionPostgresql;
function pingKamailio() {
    return shell.exec('curl localhost:8080', { silent: true }).code === 0;
}
exports.pingKamailio = pingKamailio;
