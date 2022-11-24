import * as shell from 'shelljs'
import * as replace from 'replace-in-file'
import * as error from './errors'
import * as checks from '../checks/openline'
import {getConfig} from '../../config/dev'

export function installCustomerOs(verbose :boolean, imageVersion: string = 'latest') :boolean {
    let result = false
    let isInstalled = checks.installCheck()

    if (isInstalled) {return true}
    else {
        console.log('⏳ getting setup config...')
        let setup = getSetupFiles(verbose, imageVersion)
        if (!setup) {return false}
        
        console.log(`⏳ installing customerOS version <${imageVersion}>...`)
        let baseInstall = customerOsInstall(verbose, imageVersion)
        if (!baseInstall) {return false}

        console.log('⏳ provisioning customerOS database...this make take a few mins...')
        let neo = provisionNeo4j(verbose)
        if (!neo) {return false}

        let psql = provisionPostgresql(verbose)
        if (!psql) {return false}
        
        if (setup == true && baseInstall == true) { result = true }
    }

    return result
  }

function getSetupFiles(verbose :boolean, imageVersion: string = 'latest') :boolean {
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
     let f14 = shell.exec(`curl -sS ${config.customerOs.neo4jProvisioning} -o openline-setup/provision-neo4j.sh`, {silent: !verbose})
     if (f14.code != 0){
        error.logError(f14.stderr, 'The file location must have moved.  Please update config/dev.ts with new location', 'Report this issue => https://github.com/openline-ai/openline-cli/issues/new/choose')
        return false
     }

    if (imageVersion != 'latest') {
        const options = {
            files: [
                './openline-setup/customer-os-api.yaml',
                './openline-setup/message-store.yaml'
            ],
            from: 'latest',
            to: imageVersion
        }
        try {
            const textReplace = replace.sync(options);
            if (verbose) {console.log('Replacement results:', textReplace)}
          }
          catch (error: any) {
            error.logError(error, 'Unable to modify config files to use specified image version')
          }
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
    let cosApiImage = config.customerOs.apiImage.concat(imageVersion)
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

    let msApiImage = config.customerOs.messageStoreImage.concat(imageVersion)
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

function provisionNeo4j(verbose :boolean) :boolean {
    let result = true
    let neo = ''
    let config = getConfig()
    let retry = 1
    let maxAttempts = config.server.timeOuts / 2

    while (neo == '') {
        if (retry < maxAttempts) {
            if (verbose) {console.log(`⏳ Neo4j starting up, please wait... ${retry}/${maxAttempts}`)}
            shell.exec('sleep 2')
            neo = shell.exec("kubectl get pods -n openline|grep neo4j-customer-os|grep Running|cut -f1 -d ' '", {silent: !verbose}).stdout
            retry++
        }
        else {
            error.logError('Provisioning Neo4j timed out', 'To retry, re-run => openline dev start')
            return false          
        }
        
    }

    let started = ''
    while (!started.includes('password')) {
        if (retry < maxAttempts) {
            if (verbose) {console.log(`⏳ Neo4j initalizing, please wait... ${retry}/${maxAttempts}`)}
            shell.exec('sleep 2')
            started = shell.exec(`kubectl logs -n openline ${neo}`, {silent: !verbose}).stdout
            retry++
        }
        else {
            error.logError('Provisioning Neo4j timed out', 'To retry, re-run => openline dev start')
            return false 
        }
    }

    if (verbose) {console.log('⏳ provisioning Neo4j, please wait...')}
    shell.exec('chmod u+x ./openline-setup/provision-neo4j.sh')
    let provisionNeo = shell.exec('./openline-setup/provision-neo4j.sh')
    if (provisionNeo.code != 0){
        error.logError(provisionNeo.stderr, 'Neo4j provisioning failed.', 'Report this issue => https://github.com/openline-ai/openline-cli/issues/new/choose')
        return false
    }

    return result
}

export function provisionPostgresql(verbose :boolean) :boolean {
    let result = true
    let sqlUser = 'openline'
    let sqlDb = 'openline'
    let sqlPw = 'password'

    let config = getConfig()
    let retry = 1
    let maxAttempts = config.server.timeOuts / 2

    let ms = ''
    while (ms == '') {
        if (retry < maxAttempts) {
            if (verbose) {console.log(`⏳ message store service starting up, please wait... ${retry}/${maxAttempts}`)}
            shell.exec('sleep 2')
            ms = shell.exec("kubectl get pods -n openline|grep message-store|grep Running| cut -f1 -d ' '", {silent: !verbose}).stdout
            retry++
        }
        else {
            error.logError('Provisioning postgreSQL timed out', 'To retry, re-run => openline dev start')
            return false
        }
    }

    let cosDb = ''
    while (cosDb == '') {
        if (retry < maxAttempts) {
            if (verbose) {console.log(`⏳ initalizing message store service, please wait... ${retry}/${maxAttempts}`)}
            shell.exec('sleep 2')
            cosDb = shell.exec("kubectl get pods -n openline|grep postgresql-customer-os-dev|grep Running| cut -f1 -d ' '", {silent: !verbose}).stdout
            retry++
        }
        else {
            error.logError('Provisioning postgreSQL timed out', 'To retry, re-run => openline dev start')
            return false
        }
    }
    cosDb = cosDb.slice(0, -1)

    if (verbose) {console.log(`⏳ connecting to ${cosDb} pod`)}
    let provision = ''
    while (provision == '') {
        if (retry < maxAttempts) {
            if (verbose) {console.log(`⏳ attempting to provision message store db, please wait... ${retry}/${maxAttempts}`)}
            shell.exec('sleep 2')
            provision = shell.exec(`echo ./openline-setup/setup.sql|xargs cat|kubectl exec -n openline -i ${cosDb} -- /bin/bash -c "PGPASSWORD=${sqlPw} psql -U ${sqlUser} ${sqlDb}"`, {silent: !verbose}).stdout
            retry++
        }
        else {
            error.logError('Provisioning message store DB timed out', 'To retry, re-run => openline dev start')
            return false
        }
    }

    shell.exec('rm -r openline-setup', {silent: true})

    return result

}