import * as shell from 'shelljs'
import * as replace from 'replace-in-file'
import * as error from './errors'
import * as checks from './dev-server-checks'
import {getConfig} from '../../config/dev'
import {deployImage, grabFile, Yaml} from './deploy'

const config = getConfig()
const NAMESPACE = 'openline'

export function installTaggedCustomerOs(verbose :boolean, imageVersion = 'latest') :boolean {
  const isInstalled = checks.installCheck()
  if (isInstalled) {
    return true
  }

  console.log('⏳ getting setup config...')
  const setup = getSetupFiles(verbose, imageVersion)
  if (!setup) {
    return false
  }

  console.log(`⏳ installing customerOS version <${imageVersion}>...`)
  const baseInstall = customerOsInstall(verbose, imageVersion)
  if (!baseInstall) {
    return false
  }

  console.log('⏳ provisioning customerOS database...this make take a few mins...')
  const neo = provisionNeo4j(verbose)
  if (!neo) {
    return false
  }

  const psql = provisionPostgresql(verbose)
  if (!psql) {
    return false
  }

  return true
}

function getSetupFiles(verbose :boolean, imageVersion = 'latest') :boolean {
  const dir = shell.exec('mkdir openline-setup')
  if (dir.code !== 0) {
    error.logError(dir.stderr, 'Could not make setup directory')
    return false
  }

  grabFile(config.customerOs.namespace, 'openline-setup/openline-namespace.json', verbose)
  grabFile(config.customerOs.apiDeployment, 'openline-setup/customer-os-api.yaml', verbose)
  grabFile(config.customerOs.apiService, 'openline-setup/customer-os-api-k8s-service.yaml', verbose)
  grabFile(config.customerOs.apiLoadbalancer, 'openline-setup/customer-os-api-k8s-loadbalancer-service.yaml', verbose)
  grabFile(config.customerOs.messageStoreDeployment, 'openline-setup/message-store.yaml', verbose)
  grabFile(config.customerOs.messageStoreService, 'openline-setup/message-store-k8s-service.yaml', verbose)
  grabFile(config.customerOs.postgresqlPersistentVolume, 'openline-setup/postgresql-persistent-volume.yaml', verbose)
  grabFile(config.customerOs.postgresqlPersistentVolumeClaim, 'openline-setup/postgresql-persistent-volume-claim.yaml', verbose)
  grabFile(config.customerOs.postgresqlHelmValues, 'openline-setup/postgresql-values.yaml', verbose)
  grabFile(config.customerOs.postgresqlSetup, 'openline-setup/setup.sql', verbose)
  grabFile(config.customerOs.neo4jHelmValues, 'openline-setup/neo4j-helm-values.yaml', verbose)
  grabFile(config.customerOs.neo4jCypher, 'openline-setup/customer-os.cypher', verbose)
  grabFile(config.customerOs.fusionauthHelmValues, 'openline-setup/fusionauth-values.yaml', verbose)
  grabFile(config.customerOs.neo4jProvisioning, 'openline-setup/provision-neo4j.sh', verbose)
  grabFile(config.customerOs.messageStoreLoadbalancer, 'openline-setup/message-store-k8s-loadbalancer-service.yaml', verbose)

  if (imageVersion !== 'latest') {
    const options = {
      files: [
        './openline-setup/customer-os-api.yaml',
        './openline-setup/message-store.yaml',
      ],
      from: 'latest',
      to: imageVersion,
    }
    try {
      const textReplace = replace.sync(options)
      if (verbose) {
        console.log('Replacement results:', textReplace)
      }
    } catch (error: any) {
      error.logError(error, 'Unable to modify config files to use specified image version')
    }
  }

  return true
}

function createNamespace(verbose :boolean) :boolean {
  const ns = shell.exec('kubectl create -f ./openline-setup/openline-namespace.json', {silent: !verbose})
  if (ns.code !== 0) {
    error.logError(ns.stderr, 'Unable to create namespace from ./openline-setup/openline-namespace.json')
    return false
  }

  return true
}

function installNeo4j(verbose :boolean) :boolean {
  shell.exec('helm repo add neo4j https://helm.neo4j.com/neo4j', {silent: !verbose})
  const neoInstall = shell.exec(`helm install neo4j-customer-os neo4j/neo4j-standalone --set volumes.data.mode=defaultStorageClass -f ./openline-setup/neo4j-helm-values.yaml --namespace ${NAMESPACE}`, {silent: !verbose})
  if (neoInstall.code !== 0) {
    error.logError(neoInstall.stderr, 'Unable to complete helm install of neo4j-standalone')
    return false
  }

  return true
}

function installPostgresql(verbose :boolean) :boolean {
  shell.exec('helm repo add bitnami https://charts.bitnami.com/bitnami', {silent: !verbose})

  // setup PostgreSQL persistent volume
  const pv = shell.exec(`kubectl apply -f ./openline-setup/postgresql-persistent-volume.yaml --namespace ${NAMESPACE}`, {silent: !verbose})
  if (pv.code !== 0) {
    error.logError(pv.stderr, 'Unable to setup postgreSQL persistent volume')
    return false
  }

  const pvc = shell.exec(`kubectl apply -f ./openline-setup/postgresql-persistent-volume-claim.yaml --namespace ${NAMESPACE}`, {silent: !verbose})
  if (pvc.code !== 0) {
    error.logError(pvc.stderr, 'Unable to setup postgreSQL persistent volume claim')
    return false
  }

  // install PostgreSQL
  const postgresql = shell.exec(`helm install --values ./openline-setup/postgresql-values.yaml postgresql-customer-os-dev bitnami/postgresql --namespace ${NAMESPACE}`, {silent: !verbose})
  if (postgresql.code !== 0) {
    error.logError(postgresql.stderr, 'Unable to complete helm install of postgresql')
    return false
  }

  return true
}

function installFusionAuth(verbose :boolean) :boolean {
  shell.exec('helm repo add fusionauth https://fusionauth.github.io/charts', {silent: !verbose})
  const fa = shell.exec(`helm install fusionauth-customer-os fusionauth/fusionauth -f ./openline-setup/fusionauth-values.yaml --namespace ${NAMESPACE}`, {silent: !verbose})
  if (fa.code !== 0) {
    error.logError(fa.stderr, 'Unable to complete helm install of fusion auth')
    return false
  }

  return true
}

function deployCustomerOs(verbose :boolean, imageVersion = 'latest') :boolean {
  // eslint-disable-next-line unicorn/prefer-spread
  const apiImage = config.customerOs.apiImage.concat(imageVersion)
  const installConfig: Yaml = {
    deployYaml: './openline-setup/customer-os-api.yaml',
    serviceYaml: './openline-setup/customer-os-api-k8s-service.yaml',
    loadbalancerYaml: './openline-setup/customer-os-api-k8s-loadbalancer-service.yaml',
  }
  const deploy = deployImage(apiImage, installConfig, verbose)
  if (deploy === false) {
    error.logError('Error loading image', 'Unable to deploy customerOS API')
    return false
  }

  return true
}

function deployMessageStore(verbose :boolean, imageVersion = 'latest') :boolean {
  // eslint-disable-next-line unicorn/prefer-spread
  const apiImage = config.customerOs.messageStoreImage.concat(imageVersion)
  const installConfig: Yaml = {
    deployYaml: './openline-setup/message-store.yaml',
    serviceYaml: './openline-setup/message-store-k8s-service.yaml',
    loadbalancerYaml: './openline-setup/message-store-k8s-loadbalancer-service.yaml',
  }
  const deploy = deployImage(apiImage, installConfig, verbose)
  if (deploy === false) {
    error.logError('Error loading image', 'Unable to deploy message store API')
    return false
  }

  return true
}

function customerOsInstall(verbose :boolean, imageVersion = 'latest') :boolean {
  const ns = createNamespace(verbose)
  if (!ns) {
    return false
  }

  const neo = installNeo4j(verbose)
  if (!neo) {
    return false
  }

  const sql = installPostgresql(verbose)
  if (!sql) {
    return false
  }

  const auth = installFusionAuth(verbose)
  if (!auth) {
    return false
  }

  const cos = deployCustomerOs(verbose, imageVersion)
  if (!cos) {
    return false
  }

  const ms = deployMessageStore(verbose, imageVersion)
  if (!ms) {
    return false
  }

  return true
}

function provisionNeo4j(verbose :boolean) :boolean {
  const result = true
  let neo = ''
  let retry = 1
  const maxAttempts = config.server.timeOuts / 2

  while (neo === '') {
    if (retry < maxAttempts) {
      if (verbose) {
        console.log(`⏳ Neo4j starting up, please wait... ${retry}/${maxAttempts}`)
      }

      shell.exec('sleep 2')
      neo = shell.exec("kubectl get pods -n openline|grep neo4j-customer-os|grep Running|cut -f1 -d ' '", {silent: !verbose}).stdout
      retry++
    } else {
      error.logError('Provisioning Neo4j timed out', 'To retry, re-run => openline dev start')
      return false
    }
  }

  let started = ''
  while (!started.includes('password')) {
    if (retry < maxAttempts) {
      if (verbose) {
        console.log(`⏳ Neo4j initalizing, please wait... ${retry}/${maxAttempts}`)
      }

      shell.exec('sleep 2')
      started = shell.exec(`kubectl logs -n openline ${neo}`, {silent: !verbose}).stdout
      retry++
    } else {
      error.logError('Provisioning Neo4j timed out', 'To retry, re-run => openline dev start')
      return false
    }
  }

  if (verbose) {
    console.log('⏳ provisioning Neo4j, please wait...')
  }

  shell.exec('chmod u+x ./openline-setup/provision-neo4j.sh')
  const provisionNeo = shell.exec('./openline-setup/provision-neo4j.sh')
  if (provisionNeo.code !== 0) {
    error.logError(provisionNeo.stderr, 'Neo4j provisioning failed.', 'Report this issue => https://github.com/openline-ai/openline-cli/issues/new/choose')
    return false
  }

  return result
}

function provisionPostgresql(verbose :boolean) :boolean {
  const result = true
  const sqlUser = 'openline'
  const sqlDb = 'openline'
  const sqlPw = 'password'

  let ms = ''
  let retry = 1
  const maxAttempts = config.server.timeOuts / 2
  while (ms === '') {
    if (retry < maxAttempts) {
      if (verbose) {
        console.log(`⏳ message store service starting up, please wait... ${retry}/${maxAttempts}`)
      }

      shell.exec('sleep 2')
      ms = shell.exec("kubectl get pods -n openline|grep message-store|grep Running| cut -f1 -d ' '", {silent: !verbose}).stdout
      retry++
    } else {
      error.logError('Provisioning postgreSQL timed out', 'To retry, re-run => openline dev start')
      return false
    }
  }

  let cosDb = ''
  while (cosDb === '') {
    if (retry < maxAttempts) {
      if (verbose) {
        console.log(`⏳ initalizing message store service, please wait... ${retry}/${maxAttempts}`)
      }

      shell.exec('sleep 2')
      cosDb = shell.exec("kubectl get pods -n openline|grep postgresql-customer-os-dev|grep Running| cut -f1 -d ' '", {silent: !verbose}).stdout
      retry++
    } else {
      error.logError('Provisioning postgreSQL timed out', 'To retry, re-run => openline dev start')
      return false
    }
  }

  cosDb = cosDb.slice(0, -1)

  if (verbose) {
    console.log(`⏳ connecting to ${cosDb} pod`)
  }

  let provision = ''
  while (provision === '') {
    if (retry < maxAttempts) {
      if (verbose) {
        console.log(`⏳ attempting to provision message store db, please wait... ${retry}/${maxAttempts}`)
      }

      shell.exec('sleep 2')
      provision = shell.exec(`echo ./openline-setup/setup.sql|xargs cat|kubectl exec -n openline -i ${cosDb} -- /bin/bash -c "PGPASSWORD=${sqlPw} psql -U ${sqlUser} ${sqlDb}"`, {silent: !verbose}).stdout
      retry++
    } else {
      error.logError('Provisioning message store DB timed out', 'To retry, re-run => openline dev start')
      return false
    }
  }

  shell.exec('rm -r openline-setup', {silent: true})
  return result
}
