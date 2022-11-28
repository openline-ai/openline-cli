import * as shell from 'shelljs'
import * as replace from 'replace-in-file'
import * as error from './errors'
import * as checks from './dev-server-checks'
import {getConfig} from '../../config/dev'
import {deployImage, grabFile, Yaml} from './deploy'

const config = getConfig()
const NAMESPACE = 'openline'
const SETUP_PATH = 'openline-setup'
// Namespace config
const NAMESPACE_CONFIG = SETUP_PATH + '/openline-namespace.json'
// customerOS API config
const API_DEPLOYMENT = SETUP_PATH + '/customer-os-api.yaml'
const API_SERVICE = SETUP_PATH + '/customer-os-api-k8s-service.yaml'
const API_LOADBALANCER = SETUP_PATH + '/customer-os-api-k8s-loadbalancer-service.yaml'
// message store API config
const MESSAGE_STORE_DEPLOYMENT = SETUP_PATH + '/message-store.yaml'
const MESSAGE_STORE_SERVICE = SETUP_PATH + '/message-store-k8s-service.yaml'
const MESSAGE_STORE_LOADBALANCER = SETUP_PATH + '/message-store-k8s-loadbalancer-service.yaml'
// postgreSQL config
const POSTGRESQL_PV = SETUP_PATH + '/postgresql-persistent-volume.yaml'
const POSTGRESQL_PVC = SETUP_PATH + '/postgresql-persistent-volume-claim.yaml'
const POSTGRESQL_HELM_VALUES = SETUP_PATH + '/postgresql-values.yaml'
const POSTGRESQL_DB_SETUP = SETUP_PATH + '/setup.sql'
// neo4j config
const NEO4J_HELM_VALUES = SETUP_PATH + '/neo4j-helm-values.yaml'
const NEO4J_CYPHER = SETUP_PATH + '/customer-os.cypher'
const NEO4J_DB_SETUP = SETUP_PATH + '/provision-neo4j.sh'
// fusion auth config
const FUSIONAUTH_HELM_VALUES = SETUP_PATH + '/fusionauth-values.yaml'

export function installTaggedCustomerOs(verbose :boolean, imageVersion = 'latest') :boolean {
  const isInstalled = checks.installCheck()
  if (isInstalled) {
    return true
  }

  shell.exec(`mkdir ${SETUP_PATH}`)
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

  shell.exec('rm -r openline-setup', {silent: true})

  return true
}

function getSetupFiles(verbose :boolean, imageVersion = 'latest') :boolean {
  grabFile(config.customerOs.namespace, `${NAMESPACE_CONFIG}`, verbose)
  grabFile(config.customerOs.apiDeployment, `${API_DEPLOYMENT}`, verbose)
  grabFile(config.customerOs.apiService, `${API_SERVICE}`, verbose)
  grabFile(config.customerOs.apiLoadbalancer, `${API_LOADBALANCER}`, verbose)
  grabFile(config.customerOs.messageStoreDeployment, `${MESSAGE_STORE_DEPLOYMENT}`, verbose)
  grabFile(config.customerOs.messageStoreService, `${MESSAGE_STORE_SERVICE}`, verbose)
  grabFile(config.customerOs.messageStoreLoadbalancer, `${MESSAGE_STORE_LOADBALANCER}`, verbose)
  grabFile(config.customerOs.postgresqlPersistentVolume, `${POSTGRESQL_PV}`, verbose)
  grabFile(config.customerOs.postgresqlPersistentVolumeClaim, `${POSTGRESQL_PVC}`, verbose)
  grabFile(config.customerOs.postgresqlHelmValues, `${POSTGRESQL_HELM_VALUES}`, verbose)
  grabFile(config.customerOs.postgresqlSetup, `${POSTGRESQL_DB_SETUP}`, verbose)
  grabFile(config.customerOs.neo4jHelmValues, `${NEO4J_HELM_VALUES}`, verbose)
  grabFile(config.customerOs.neo4jCypher, `${NEO4J_CYPHER}`, verbose)
  grabFile(config.customerOs.neo4jProvisioning, `${NEO4J_DB_SETUP}`, verbose)
  grabFile(config.customerOs.fusionauthHelmValues, `${FUSIONAUTH_HELM_VALUES}`, verbose)

  if (imageVersion !== 'latest') {
    const options = {
      files: [
        `./${API_DEPLOYMENT}`,
        `./${MESSAGE_STORE_DEPLOYMENT}`,
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
  const ns = shell.exec(`kubectl create -f ./${NAMESPACE_CONFIG}`, {silent: !verbose})
  if (ns.code !== 0) {
    error.logError(ns.stderr, `Unable to create namespace from ./${NAMESPACE_CONFIG}`)
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
  const pv = shell.exec(`kubectl apply -f ./${SETUP_PATH}/postgresql-persistent-volume.yaml --namespace ${NAMESPACE}`, {silent: !verbose})
  if (pv.code !== 0) {
    error.logError(pv.stderr, 'Unable to setup postgreSQL persistent volume')
    return false
  }

  const pvc = shell.exec(`kubectl apply -f ./${SETUP_PATH}/postgresql-persistent-volume-claim.yaml --namespace ${NAMESPACE}`, {silent: !verbose})
  if (pvc.code !== 0) {
    error.logError(pvc.stderr, 'Unable to setup postgreSQL persistent volume claim')
    return false
  }

  // install PostgreSQL
  const postgresql = shell.exec(`helm install --values ./${SETUP_PATH}/postgresql-values.yaml postgresql-customer-os-dev bitnami/postgresql --namespace ${NAMESPACE}`, {silent: !verbose})
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
    deployYaml: `./${API_DEPLOYMENT}`,
    serviceYaml: `./${API_SERVICE}`,
    loadbalancerYaml: `./${API_LOADBALANCER}`,
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
    deployYaml: `./${MESSAGE_STORE_DEPLOYMENT}`,
    serviceYaml: `./${MESSAGE_STORE_SERVICE}`,
    loadbalancerYaml: `./${MESSAGE_STORE_LOADBALANCER}`,
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

  shell.exec(`chmod u+x ./${NEO4J_DB_SETUP}`)
  const provisionNeo = shell.exec(`./${NEO4J_DB_SETUP}`)
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
      provision = shell.exec(`echo ./${POSTGRESQL_DB_SETUP}|xargs cat|kubectl exec -n ${NAMESPACE} -i ${cosDb} -- /bin/bash -c "PGPASSWORD=${sqlPw} psql -U ${sqlUser} ${sqlDb}"`, {silent: !verbose}).stdout
      retry++
    } else {
      error.logError('Provisioning message store DB timed out', 'To retry, re-run => openline dev start')
      return false
    }
  }

  return result
}
