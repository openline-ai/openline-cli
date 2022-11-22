import * as shell from 'shelljs'
import * as error from '../../errors'
import * as checks from '../checks/openline'
import {getConfig} from '../../config/dev'

export function installCustomerOs(verbose :boolean, imageVersion: string = 'latest') :boolean {
    let result = false
    let isInstalled = checks.installCheck(verbose)

    if (isInstalled) {return true}
    else {
        let setup = getSetupFiles(verbose)
        if (!setup) {return false}
        
        let baseInstall = customerOsInstall(verbose, imageVersion)
        if (!baseInstall) {return false}

        let deploy = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/scripts/3-db-setup.sh'
        let deployed = shell.exec(`curl -sL ${deploy} | bash`, {silent: !verbose})
        if (deployed.code != 0) {
            error.logError(deployed.stderr, '🫣 Looks like our repo references moved.  Update and try again.', 'https://github.com/openline-ai/openline-customer-os/tree/otter/deployment/scripts')
            return result
        }
        
        if (setup == true && baseInstall == true && deployed.code == 0) { result = true }
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

function customerOsInstall(verbose :boolean, imageVersion: string = 'latest') :boolean {
    let result = true
    let config = getConfig()
    let namespace = 'openline'
    let reportIssue = 'https://github.com/openline-ai/openline-cli/issues/new/choose'

    // create the namespace in kubernetes
    let ns = shell.exec('kubectl create -f ./openline-setup/openline-namespace.json', {silent: !verbose})
    if (ns.code != 0) {
        error.logError(ns.stderr, 'Unable to create namespace from ./openline-setup/openline-namespace.json', `Report this issue => ${reportIssue}`)
        return false
    }
    
    // add helm repos
    let postgre = shell.exec('helm repo add bitnami https://charts.bitnami.com/bitnami', {silent: !verbose})
    let neo = shell.exec('helm repo add neo4j https://helm.neo4j.com/neo4j', {silent: !verbose})
    let fauth = shell.exec('helm repo add fusionauth https://fusionauth.github.io/charts', {silent: !verbose})

    // install neo4j
    let neoInstall = shell.exec(`helm install neo4j-customer-os neo4j/neo4j-standalone --set volumes.data.mode=defaultStorageClass -f ./openline-setup/neo4j-helm-values.yaml --namespace ${namespace}`, {silent: !verbose})
    if (neoInstall.code != 0) {
        error.logError(neoInstall.stderr, 'Unable to complete helm install of neo4j-standalone', `Report this issue => ${reportIssue}`)
        return false
    }

    // setup PostgreSQL persistent volume
    let pv = shell.exec(`kubectl apply -f ./openline-setup/postgresql-persistent-volume.yaml --namespace ${namespace}`, {silent: !verbose})
    if (pv.code != 0) {
        error.logError(pv.stderr, 'Unable to setup postgreSQL persistent volume', `Report this issue => ${reportIssue}`)
        return false
    }

    let pvc = shell.exec(`kubectl apply -f ./openline-setup/postgresql-persistent-volume-claim.yaml --namespace ${namespace}`, {silent: !verbose})
    if (pvc.code != 0) {
        error.logError(pvc.stderr, 'Unable to setup postgreSQL persistent volume claim', `Report this issue => ${reportIssue}`)
        return false
    }

    // install PostgreSQL
    let postgresql = shell.exec(`helm install --values ./openline-setup/postgresql-values.yaml postgresql-customer-os-dev bitnami/postgresql --namespace ${namespace}`, {silent: !verbose})
    if (postgresql.code != 0) {
        error.logError(postgresql.stderr, 'Unable to complete helm install of postgresql', `Report this issue => ${reportIssue}`)
        return false
    }

    // deploy customerOS API container image
    let cosApiImage = config.customerOs.apiImage.concat(imageVersion.toLowerCase())
    let cosPull = shell.exec(`docker pull ${cosApiImage}`, {silent: !verbose})
    if (cosPull.code !=0) {
        error.logError(cosPull.stderr, `Unable to pull image ${cosApiImage}`, `Report this issue => ${reportIssue}`)
        return false
    }

    let cosDeploy = shell.exec(`kubectl apply -f ./openline-setup/customer-os-api.yaml --namespace ${namespace}`, {silent: !verbose})
    if (cosDeploy.code != 0) {
        error.logError(cosDeploy.stderr, 'Unable to deploy customerOS API', `Report this issue => ${reportIssue}`)
        return false
    }

    let cosService = shell.exec(`kubectl apply -f ./openline-setup/customer-os-api-k8s-service.yaml --namespace ${namespace}`, {silent: !verbose})
    if (cosService.code != 0) {
        error.logError(cosService.stderr, 'Unable to deploy customerOS API', `Report this issue => ${reportIssue}`)
        return false
    }

    let cosLoad = shell.exec(`kubectl apply -f ./openline-setup/customer-os-api-k8s-loadbalancer-service.yaml --namespace ${namespace}`, {silent: !verbose})
    if (cosLoad.code != 0) {
        error.logError(cosLoad.stderr, 'Unable to deploy customerOS API', `Report this issue => ${reportIssue}`)
        return false
    }

    // deploy message store API container image

    let msApiImage = config.customerOs.messageStoreImage.concat(imageVersion.toLowerCase())
    let msPull = shell.exec(`docker pull ${msApiImage}`, {silent: !verbose})
    if (msPull.code != 0) {
        error.logError(msPull.stderr, `Unable to pull image ${msApiImage}`, `Report this issue => ${reportIssue}`)
        return false
    }

    let msDeploy = shell.exec(`kubectl apply -f ./openline-setup/message-store.yaml --namespace ${namespace}`, {silent: !verbose})
    if (msDeploy.code != 0) {
        error.logError(msDeploy.stderr, 'Unable to deploy message store API', `Report this issue => ${reportIssue}`)
        return false
    }

    let msService = shell.exec(`kubectl apply -f ./openline-setup/message-store-k8s-service.yaml --namespace ${namespace}`, {silent: !verbose})
    if (msService.code != 0) {
        error.logError(msService.stderr, 'Unable to deploy message store API', `Report this issue => ${reportIssue}`)
        return false
    }

    // install fusion auth

    let fa = shell.exec(`helm install fusionauth-customer-os fusionauth/fusionauth -f ./openline-setup/fusionauth-values.yaml --namespace ${namespace}`, {silent: !verbose})
    if (fa.code != 0) {
        error.logError(fa.stderr, 'Unable to complete helm install of fusion auth', `Report this issue => ${reportIssue}`)
        return false
    }

    return result
}