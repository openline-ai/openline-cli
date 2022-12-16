"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingOasisGui = exports.pingOasisApi = exports.pingChannelsApi = exports.installOasisGui = exports.installOasisApi = exports.installChannelsApi = void 0;
const shell = require("shelljs");
const dev_1 = require("../../config/dev");
const deploy_1 = require("./deploy");
const build_image_1 = require("./build-image");
const logs_1 = require("../logs");
const config = (0, dev_1.getConfig)();
const NAMESPACE = config.namespace.name;
const CHANNELS_API = 'channels-api-service';
const OASIS_API = 'oasis-api-service';
const OASIS_GUI = 'oasis-gui-service';
function channelsApiCheck() {
    return (shell.exec(`kubectl get service ${CHANNELS_API} -n ${NAMESPACE}`, { silent: true }).code === 0);
}
function oasisApiCheck() {
    return (shell.exec(`kubectl get service ${OASIS_API} -n ${NAMESPACE}`, { silent: true }).code === 0);
}
function oasisGuiCheck() {
    return (shell.exec(`kubectl get service ${OASIS_GUI} -n ${NAMESPACE}`, { silent: true }).code === 0);
}
function installChannelsApi(verbose, location = config.setupDir, imageVersion = 'latest') {
    if (channelsApiCheck())
        return true;
    const DEPLOYMENT = location + config.oasis.channelsApiDeployment;
    const SERVICE = location + config.oasis.channelsApiService;
    const LOADBALANCER = location + config.oasis.channelsApiLoadbalancer;
    if (imageVersion.toLowerCase() !== 'latest') {
        const tag = (0, deploy_1.updateImageTag)([DEPLOYMENT], imageVersion);
        if (!tag)
            return false;
    }
    let image = config.oasis.channelsApiImage + imageVersion;
    if (location !== config.setupDir) {
        // come back to this when Dockerfiles are standardized
        const buildPath = location + '/packages/server/channels-api';
        (0, build_image_1.buildLocalImage)(buildPath, buildPath + '/../', image, verbose);
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
    (0, logs_1.logTerminal)('SUCCESS', 'channels-api successfully installed');
    return true;
}
exports.installChannelsApi = installChannelsApi;
function installOasisApi(verbose, location = config.setupDir, imageVersion = 'latest') {
    if (oasisApiCheck())
        return true;
    const DEPLOYMENT = location + config.oasis.apiDeployment;
    const SERVICE = location + config.oasis.apiService;
    const LOADBALANCER = location + config.oasis.apiLoadbalancer;
    if (imageVersion.toLowerCase() !== 'latest') {
        const tag = (0, deploy_1.updateImageTag)([DEPLOYMENT], imageVersion);
        if (!tag)
            return false;
    }
    let image = config.oasis.apiImage + imageVersion;
    if (location !== config.setupDir) {
        // come back to this when Dockerfiles are cleaned up
        const buildPath = location + '/packages/server/oasis-api';
        (0, build_image_1.buildLocalImage)(buildPath, buildPath + '/../', image, verbose);
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
    (0, logs_1.logTerminal)('SUCCESS', 'oasis-api successfully installed');
    return true;
}
exports.installOasisApi = installOasisApi;
function installOasisGui(verbose, location = config.setupDir, imageVersion = 'latest') {
    if (oasisGuiCheck())
        return true;
    const DEPLOYMENT = location + config.oasis.guiDeployment;
    const SERVICE = location + config.oasis.guiService;
    const LOADBALANCER = location + config.oasis.guiLoadbalancer;
    if (imageVersion.toLowerCase() !== 'latest') {
        const tag = (0, deploy_1.updateImageTag)([DEPLOYMENT], imageVersion);
        if (!tag)
            return false;
    }
    let image = config.oasis.guiImage + imageVersion;
    if (location !== config.setupDir) {
        // come back to this when Dockerfiles are cleaned up
        const buildPath = location + '/packages/apps/oasis/oasis-frontend';
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
    (0, logs_1.logTerminal)('SUCCESS', 'oasis-gui successfully installed');
    return true;
}
exports.installOasisGui = installOasisGui;
function pingChannelsApi() {
    return shell.exec('curl localhost:8013/health', { silent: true }).code === 0;
}
exports.pingChannelsApi = pingChannelsApi;
function pingOasisApi() {
    return shell.exec('curl localhost:8006/health', { silent: true }).code === 0;
}
exports.pingOasisApi = pingOasisApi;
function pingOasisGui() {
    return shell.exec('curl localhost:3006', { silent: true }).code === 0;
}
exports.pingOasisGui = pingOasisGui;
