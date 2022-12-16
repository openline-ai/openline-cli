"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingMessageStoreApi = exports.pingCustomerOsApi = exports.installMessageStoreApi = exports.installCustomerOsApi = void 0;
const shell = require("shelljs");
const dev_1 = require("../../config/dev");
const deploy_1 = require("./deploy");
const build_image_1 = require("./build-image");
const logs_1 = require("../logs");
const config = (0, dev_1.getConfig)();
const NAMESPACE = config.namespace.name;
const CUSTOMER_OS_API = 'customer-os-api-service';
const MESSAGE_STORE_API = 'message-store-api-service';
function customerOsApiCheck() {
    return (shell.exec(`kubectl get service ${CUSTOMER_OS_API} -n ${NAMESPACE}`, { silent: true }).code === 0);
}
function messageStoreApiCheck() {
    return (shell.exec(`kubectl get service ${MESSAGE_STORE_API} -n ${NAMESPACE}`, { silent: true }).code === 0);
}
function installCustomerOsApi(verbose, location = config.setupDir, imageVersion = 'latest') {
    if (customerOsApiCheck())
        return true;
    const DEPLOYMENT = location + config.customerOs.apiDeployment;
    const SERVICE = location + config.customerOs.apiService;
    const LOADBALANCER = location + config.customerOs.apiLoadbalancer;
    if (imageVersion.toLowerCase() !== 'latest') {
        const tag = (0, deploy_1.updateImageTag)([DEPLOYMENT], imageVersion);
        if (!tag)
            return false;
    }
    let image = config.customerOs.apiImage + imageVersion;
    if (location !== config.setupDir) {
        // Need to come back to this after we standardize Dockerfiles
        const buildPath = location + '/packages/server/customer-os-api';
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
    (0, logs_1.logTerminal)('SUCCESS', 'customer-os-api successfully installed');
    return true;
}
exports.installCustomerOsApi = installCustomerOsApi;
function installMessageStoreApi(verbose, location = config.setupDir, imageVersion = 'latest') {
    if (messageStoreApiCheck())
        return true;
    const DEPLOYMENT = location + config.customerOs.messageStoreDeployment;
    const SERVICE = location + config.customerOs.messageStoreService;
    const LOADBALANCER = location + config.customerOs.messageStoreLoadbalancer;
    if (imageVersion.toLowerCase() !== 'latest') {
        const tag = (0, deploy_1.updateImageTag)([DEPLOYMENT], imageVersion);
        if (!tag)
            return false;
    }
    let image = config.customerOs.messageStoreImage + imageVersion;
    if (location !== config.setupDir) {
        // come back to this
        const buildPath = location + '/packages/server/message-store';
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
    (0, logs_1.logTerminal)('SUCCESS', 'message-store-api successfully installed');
    return true;
}
exports.installMessageStoreApi = installMessageStoreApi;
function pingCustomerOsApi() {
    return shell.exec('curl localhost:10000/health', { silent: true }).code === 0;
}
exports.pingCustomerOsApi = pingCustomerOsApi;
function pingMessageStoreApi() {
    return shell.exec('nc -zv -w5 localhost 9009', { silent: true }).code === 0;
}
exports.pingMessageStoreApi = pingMessageStoreApi;
