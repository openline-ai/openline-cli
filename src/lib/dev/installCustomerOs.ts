import * as shell from 'shelljs'
import * as error from '../../errors'
import * as checks from '../checks/openline'
import {getConfig} from '../../config/dev'

export function installCustomerOs(verbose :boolean) :boolean {
    let result = false
    let isInstalled = checks.installCheck(verbose)

    if (isInstalled) {
        result = true
    }
    else {
        let setup = getSetupFiles(verbose)
        
        let baseInstall = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/scripts/2-install.sh'
        let base = shell.exec(`curl -sL ${baseInstall} | bash`, {silent: !verbose})
        if (base.code != 0) {
            error.logError(base.stderr, '🫣 Looks like our repo references moved.  Update and try again.', 'https://github.com/openline-ai/openline-customer-os/tree/otter/deployment/scripts')
            return result
        }

        let deploy = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/scripts/3-db-setup.sh'
        let deployed = shell.exec(`curl -sL ${deploy} | bash`, {silent: !verbose})
        if (deployed.code != 0) {
            error.logError(base.stderr, '🫣 Looks like our repo references moved.  Update and try again.', 'https://github.com/openline-ai/openline-customer-os/tree/otter/deployment/scripts')
            return result
        }
        
        if (setup == true && base.code == 0 && deployed.code == 0) { result = true }
    }

    return result
  }

function getSetupFiles(verbose :boolean) :boolean {
    let result = true
    let config = getConfig()

    let dir = shell.exec('mkdir openline-setup')

    let f1 = shell.exec(`curl -sS ${config.customerOs.namespace} -o openline-setup/openline-namespace.json`, {silent: !verbose})
    if (f1.code != 0) {
       error.logError(f1.stderr, 'The file location must have moved.  Please update config/dev.ts with new location', 'Report this issue => https://github.com/openline-ai/openline-cli/issues/new/choose')
       return false
    }
    let f2 = shell.exec(`curl -sS ${config.customerOs.apiDeployment} -o openline-setup/customer-os-api.yaml`, {silent: !verbose})
    if (f2.code != 0) {
        error.logError(f2.stderr, 'The file location must have moved.  Please update config/dev.ts with new location', 'Report this issue => https://github.com/openline-ai/openline-cli/issues/new/choose')
        return false
     }
    let f3 = shell.exec(`curl -sS ${config.customerOs.apiService} -o openline-setup/customer-os-api-k8s-service.yaml`, {silent: !verbose})
    if (f3.code != 0) {
        error.logError(f3.stderr, 'The file location must have moved.  Please update config/dev.ts with new location', 'Report this issue => https://github.com/openline-ai/openline-cli/issues/new/choose')
        return false
     }
    let f4 = shell.exec(`curl -sS ${config.customerOs.apiLoadbalancer} -o openline-setup/customer-os-api-k8s-loadbalancer-service.yaml`, {silent: !verbose})
    if (f4.code != 0) {
        error.logError(f4.stderr, 'The file location must have moved.  Please update config/dev.ts with new location', 'Report this issue => https://github.com/openline-ai/openline-cli/issues/new/choose')
        return false
     }
    let f5 = shell.exec(`curl -sS ${config.customerOs.messageStoreDeployment} -o openline-setup/message-store.yaml`, {silent: !verbose})
    if (f5.code != 0) {
        error.logError(f5.stderr, 'The file location must have moved.  Please update config/dev.ts with new location', 'Report this issue => https://github.com/openline-ai/openline-cli/issues/new/choose')
        return false
     }
    let f6 = shell.exec(`curl -sS ${config.customerOs.messageStoreService} -o openline-setup/message-store-k8s-service.yaml`, {silent: !verbose})
    if (f6.code != 0) {
        error.logError(f6.stderr, 'The file location must have moved.  Please update config/dev.ts with new location', 'Report this issue => https://github.com/openline-ai/openline-cli/issues/new/choose')
        return false
     }
    let f7 = shell.exec(`curl -sS ${config.customerOs.postgresqlPersistentVolume} -o openline-setup/postgresql-persistent-volume.yaml`, {silent: !verbose})
    if (f7.code != 0) {
        error.logError(f7.stderr, 'The file location must have moved.  Please update config/dev.ts with new location', 'Report this issue => https://github.com/openline-ai/openline-cli/issues/new/choose')
        return false
     }
    let f8 = shell.exec(`curl -sS ${config.customerOs.postgresqlPersistentVolumeClaim} -o openline-setup/postgresql-persistent-volume-claim.yaml`, {silent: !verbose})
    if (f8.code != 0) {
        error.logError(f8.stderr, 'The file location must have moved.  Please update config/dev.ts with new location', 'Report this issue => https://github.com/openline-ai/openline-cli/issues/new/choose')
        return false
     }
    let f9 = shell.exec(`curl -sS ${config.customerOs.postgresqlHelmValues} -o openline-setup/postgresql-values.yaml`, {silent: !verbose})
    if (f9.code != 0) {
        error.logError(f9.stderr, 'The file location must have moved.  Please update config/dev.ts with new location', 'Report this issue => https://github.com/openline-ai/openline-cli/issues/new/choose')
        return false
     }
    let f10 = shell.exec(`curl -sS ${config.customerOs.postgresqlSetup} -o openline-setup/setup.sql`, {silent: !verbose})
    if (f10.code != 0) {
        error.logError(f10.stderr, 'The file location must have moved.  Please update config/dev.ts with new location', 'Report this issue => https://github.com/openline-ai/openline-cli/issues/new/choose')
        return false
     }
    let f11 = shell.exec(`curl -sS ${config.customerOs.neo4jHelmValues} -o openline-setup/neo4j-helm-values.yaml`, {silent: !verbose})
    if (f11.code != 0) {
        error.logError(f11.stderr, 'The file location must have moved.  Please update config/dev.ts with new location', 'Report this issue => https://github.com/openline-ai/openline-cli/issues/new/choose')
        return false
     }
    let f12 = shell.exec(`curl -sS ${config.customerOs.neo4jCypher} -o openline-setup/customer-os.cypher`, {silent: !verbose})
    if (f12.code != 0) {
        error.logError(f12.stderr, 'The file location must have moved.  Please update config/dev.ts with new location', 'Report this issue => https://github.com/openline-ai/openline-cli/issues/new/choose')
        return false
     }
    let f13 = shell.exec(`curl -sS ${config.customerOs.fusionauthHelmValues} -o openline-setup/fusionauth-values.yaml`, {silent: !verbose})
    if (f13.code != 0) {
        error.logError(f13.stderr, 'The file location must have moved.  Please update config/dev.ts with new location', 'Report this issue => https://github.com/openline-ai/openline-cli/issues/new/choose')
        return false
     }


    return result
}