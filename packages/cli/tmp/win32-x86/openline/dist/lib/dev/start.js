"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installDatabases = exports.startDevServer = exports.dependencyCheck = exports.cleanupSetupFiles = void 0;
const logs_1 = require("../logs");
const mac_dependency_check_1 = require("../mac-dependency-check");
const linux_dependency_check_1 = require("../linux-dependency-check");
const colima = require("./colima");
const k3d = require("./k3d");
const shell = require("shelljs");
const dev_1 = require("../../config/dev");
const neo4j_1 = require("./neo4j");
const postgres_1 = require("./postgres");
const dependencies_1 = require("../dependencies");
function cleanupSetupFiles() {
    // cleanup old setup files
    const config = (0, dev_1.getConfig)();
    const dirCheck = shell.exec(`ls ${config.setupDir}`, { silent: true }).code === 0;
    if (dirCheck)
        shell.exec(`rm -r ${config.setupDir}`, { silent: true });
}
exports.cleanupSetupFiles = cleanupSetupFiles;
function dependencyCheck(verbose) {
    // macOS check
    switch (process.platform) {
        case 'darwin':
            return (0, mac_dependency_check_1.installDependencies)(verbose);
        case 'linux':
            return (0, linux_dependency_check_1.installDependencies)(verbose);
        default:
            (0, logs_1.logTerminal)('ERROR', 'Operating system unsupported at this time');
            return false;
    }
}
exports.dependencyCheck = dependencyCheck;
function startDevServer(verbose) {
    const isRunning = colima.runningCheck();
    if (!isRunning) {
        (0, logs_1.logTerminal)('INFO', 'initiating Openline dev server...');
        switch ((0, dependencies_1.getPlatform)()) {
            case 'mac':
                return colima.startColima(verbose);
            case 'linux':
                return k3d.startk3d(verbose);
        }
    }
    // set permissions on kube config
    const updatePermissions = 'chmod og-r ~/.kube/config';
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', updatePermissions);
    shell.exec(updatePermissions, { silent: true });
    return true;
}
exports.startDevServer = startDevServer;
function installDatabases(verbose, location) {
    if (verbose)
        (0, logs_1.logTerminal)('INFO', 'installing customerOS databases...');
    (0, neo4j_1.installNeo4j)(verbose, location);
    (0, postgres_1.installPostgresql)(verbose, location);
    (0, logs_1.logTerminal)('SUCCESS', 'customerOS databases succesfully installed');
    return true;
}
exports.installDatabases = installDatabases;
