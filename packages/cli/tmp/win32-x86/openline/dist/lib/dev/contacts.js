"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingContactsGui = exports.installContactsGui = void 0;
const shell = require("shelljs");
const dev_1 = require("../../config/dev");
const deploy_1 = require("./deploy");
const build_image_1 = require("./build-image");
const logs_1 = require("../logs");
const config = (0, dev_1.getConfig)();
const NAMESPACE = config.namespace.name;
const CONTACTS_GUI = 'contacts-gui-service';
function contactsGuiCheck() {
    return (shell.exec(`kubectl get service ${CONTACTS_GUI} -n ${NAMESPACE}`, { silent: true }).code === 0);
}
function installContactsGui(verbose, location = config.setupDir, imageVersion = 'latest') {
    if (contactsGuiCheck())
        return true;
    const CONTACTS_IMAGE = 'contacts-gui';
    const DEPLOYMENT = location + config.contacts.guiDeployment;
    const SERVICE = location + config.contacts.guiService;
    const LOADBALANCER = location + config.contacts.guiLoadbalancer;
    if (imageVersion.toLowerCase() !== 'latest') {
        const tag = (0, deploy_1.updateImageTag)([DEPLOYMENT], imageVersion);
        if (!tag)
            return false;
    }
    let image = config.contacts.guiImage + imageVersion;
    if (location !== config.setupDir) {
        // come back to this when Dockerfiles are standardized
        const buildPath = location + '/packages/apps/contacts';
        (0, build_image_1.buildLocalImage)(buildPath, buildPath, CONTACTS_IMAGE, verbose);
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
    (0, logs_1.logTerminal)('SUCCESS', 'contacts-gui successfully installed');
    return true;
}
exports.installContactsGui = installContactsGui;
function pingContactsGui() {
    return shell.exec('curl localhost:3001', { silent: true }).code === 0;
}
exports.pingContactsGui = pingContactsGui;
