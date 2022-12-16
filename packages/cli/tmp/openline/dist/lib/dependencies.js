"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installXcode = exports.xcodeCheck = exports.installKube = exports.kubeCheck = exports.installNetcat = exports.netcatCheck = exports.installBrew = exports.brewCheck = exports.installHelm = exports.helmCheck = exports.installGit = exports.gitCheck = exports.installDocker = exports.dockerCheck = exports.installK3d = exports.k3dCheck = exports.installColima = exports.colimaCheck = exports.checkDockerGroup = exports.createSetupDir = exports.setupDirCheck = exports.getPlatform = void 0;
const node_process_1 = require("node:process");
const shell = require("shelljs");
const dev_1 = require("../config/dev");
const logs_1 = require("./logs");
const config = (0, dev_1.getConfig)();
const fs = require("fs");
function getPlatform() {
    switch (process.platform) {
        case 'darwin':
            return 'mac';
        case 'linux':
            return 'linux';
        default:
            (0, logs_1.logTerminal)('ERROR', 'Operating system unsupported at this time');
            return 'unknown';
    }
}
exports.getPlatform = getPlatform;
function setupDirCheck() {
    return (fs.existsSync(config.setupDir));
}
exports.setupDirCheck = setupDirCheck;
function createSetupDir() {
    (0, logs_1.logTerminal)('INFO', 'Creating Setup Dir');
    const result = shell.exec('mkdir -p ' + config.setupDir).code === 0;
    if (result) {
        (0, logs_1.logTerminal)('SUCCESS', 'Setup dir created');
    }
    else {
        (0, logs_1.logTerminal)('ERROR', 'Failed to create setup dir');
        (0, node_process_1.exit)(1);
    }
    return true;
}
exports.createSetupDir = createSetupDir;
function checkDockerGroup() {
    const result = shell.exec('groups', { silent: true }).stdout.includes('docker');
    if (result) {
        (0, logs_1.logTerminal)('SUCCESS', 'User in Docker group');
    }
    else {
        (0, logs_1.logTerminal)('ERROR', 'User Not Yet in Docker Group', 'Please log out and back in then re-run the command');
        (0, node_process_1.exit)(1);
    }
}
exports.checkDockerGroup = checkDockerGroup;
// colima
function colimaCheck() {
    return (shell.exec('which colima', { silent: true }).code === 0);
}
exports.colimaCheck = colimaCheck;
function installColima() {
    (0, logs_1.logTerminal)('INFO', 'We need to install colima before continuing');
    const result = shell.exec(config.dependencies[getPlatform()].colima).code === 0;
    if (result) {
        (0, logs_1.logTerminal)('SUCCESS', 'colima successfully installed');
    }
    else {
        (0, logs_1.logTerminal)('ERROR', 'colima installation failed', 'Please install colima before retrying the command.');
        (0, node_process_1.exit)(1);
    }
    return true;
}
exports.installColima = installColima;
// colima
function k3dCheck() {
    return (shell.exec('which k3d', { silent: true }).code === 0);
}
exports.k3dCheck = k3dCheck;
function installK3d() {
    (0, logs_1.logTerminal)('INFO', 'We need to install k3d before continuing');
    const result = shell.exec(config.dependencies[getPlatform()].k3d).code === 0;
    if (result) {
        (0, logs_1.logTerminal)('SUCCESS', 'k3d successfully installed');
    }
    else {
        (0, logs_1.logTerminal)('ERROR', 'k3d installation failed', 'Please install k3d before retrying the command.');
        (0, node_process_1.exit)(1);
    }
    return true;
}
exports.installK3d = installK3d;
// docker
function dockerCheck() {
    return (shell.exec('which docker', { silent: true }).code === 0);
}
exports.dockerCheck = dockerCheck;
function installDocker() {
    (0, logs_1.logTerminal)('INFO', 'We need to install docker before continuing');
    const result = shell.exec(config.dependencies[getPlatform()].docker).code === 0;
    if (result) {
        (0, logs_1.logTerminal)('SUCCESS', 'docker successfully installed');
    }
    else {
        (0, logs_1.logTerminal)('ERROR', 'docker installation failed', 'Please install docker before retrying the command.');
        (0, node_process_1.exit)(1);
    }
    return true;
}
exports.installDocker = installDocker;
// git
function gitCheck() {
    return (shell.exec('which git', { silent: true }).code === 0);
}
exports.gitCheck = gitCheck;
function installGit() {
    (0, logs_1.logTerminal)('INFO', 'We need to install git before continuing');
    const results = shell.exec(config.dependencies[getPlatform()].git).code === 0;
    if (results) {
        (0, logs_1.logTerminal)('SUCCESS', 'git successfully installed');
    }
    else {
        (0, logs_1.logTerminal)('ERROR', 'git installation failed', 'Please install git before retrying the command.');
        (0, node_process_1.exit)(1);
    }
    return true;
}
exports.installGit = installGit;
// helm
function helmCheck() {
    return (shell.exec('which helm', { silent: true }).code === 0);
}
exports.helmCheck = helmCheck;
function installHelm() {
    (0, logs_1.logTerminal)('INFO', 'We need to install helm before continuing');
    const results = shell.exec(config.dependencies[getPlatform()].helm).code === 0;
    if (results) {
        (0, logs_1.logTerminal)('SUCCESS', 'helm successfully installed');
    }
    else {
        (0, logs_1.logTerminal)('ERROR', 'helm installation failed', 'Please install helm before retrying the command.');
        (0, node_process_1.exit)(1);
    }
    return true;
}
exports.installHelm = installHelm;
// homebrew
function brewCheck() {
    return (shell.exec('which brew', { silent: true }).code === 0);
}
exports.brewCheck = brewCheck;
function installBrew() {
    (0, logs_1.logTerminal)('INFO', 'We need to install homebrew before continuing.', 'Process will exit after install as you will need to set your path.  Please follow the instructions at the end of the installation.');
    const results = shell.exec(config.dependencies.mac.homebrew).code === 0;
    if (results) {
        (0, logs_1.logTerminal)('SUCCESS', 'homebrew successfully installed  Please follow the homebrew instructions above, and once complete, restart the command.');
        (0, node_process_1.exit)(0);
    }
    else {
        (0, logs_1.logTerminal)('ERROR', 'homebrew installation failed', 'Please install homebrew before retrying the command.');
        (0, node_process_1.exit)(1);
    }
}
exports.installBrew = installBrew;
// netcat
function netcatCheck() {
    return (shell.exec('which nc', { silent: true }).code === 0);
}
exports.netcatCheck = netcatCheck;
function installNetcat() {
    (0, logs_1.logTerminal)('INFO', 'We need to install netcat before continuing');
    const results = shell.exec(config.dependencies[getPlatform()].netcat).code === 0;
    if (results) {
        (0, logs_1.logTerminal)('SUCCESS', 'netcat successfully installed');
    }
    else {
        (0, logs_1.logTerminal)('ERROR', 'netcat installation failed', 'Please install netcat before retrying the command.');
        (0, node_process_1.exit)(1);
    }
}
exports.installNetcat = installNetcat;
// kubectl
function kubeCheck() {
    return (shell.exec('which kubectl', { silent: true }).code === 0);
}
exports.kubeCheck = kubeCheck;
function installKube() {
    (0, logs_1.logTerminal)('INFO', 'We need to install kubectl before continuing');
    const results = shell.exec(config.dependencies[getPlatform()].kubectl).code === 0;
    if (results) {
        (0, logs_1.logTerminal)('SUCCESS', 'kubectl successfully installed');
    }
    else {
        (0, logs_1.logTerminal)('ERROR', 'kubectl installation failed', 'Please install kubectl before retrying the command.');
        (0, node_process_1.exit)(1);
    }
}
exports.installKube = installKube;
// xcode
function xcodeCheck() {
    return (shell.exec('which xcode-select', { silent: true }).code === 0);
}
exports.xcodeCheck = xcodeCheck;
function installXcode() {
    (0, logs_1.logTerminal)('INFO', 'We need to install xcode before continuing');
    const results = shell.exec(config.dependencies.mac.xcode).code === 0;
    if (results) {
        (0, logs_1.logTerminal)('SUCCESS', 'xcode successfully installed');
    }
    else {
        (0, logs_1.logTerminal)('ERROR', 'xcode installation failed', 'Please install xcode before retrying the command.');
        (0, node_process_1.exit)(1);
    }
}
exports.installXcode = installXcode;
