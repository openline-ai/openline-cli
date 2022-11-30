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
  if (isInstalled) return true

  shell.exec(`mkdir ${SETUP_PATH}`)
  console.log('⏳ getting setup config...')
  const setup = getSetupFiles(verbose, imageVersion)
  if (!setup) return false

  console.log(`⏳ installing customerOS version <${imageVersion}>...`)
  const baseInstall = customerOsInstall(verbose, imageVersion)
  if (!baseInstall) return false

  console.log('⏳ provisioning customerOS database...this make take a few mins...')
  const neo = provisionNeo4j(verbose)
  if (!neo) return false

  const psql = provisionPostgresql(verbose)
  if (!psql) return false

  shell.exec(`rm -r ${SETUP_PATH}`, {silent: true})

  return true
}

function getSetupFiles(verbose :boolean, imageVersion = 'latest') :boolean {
  
  grabFile(config.customerOs.apiDeployment, API_DEPLOYMENT, verbose)
  grabFile(config.customerOs.apiService, API_SERVICE, verbose)
  grabFile(config.customerOs.apiLoadbalancer, API_LOADBALANCER, verbose)
  grabFile(config.customerOs.messageStoreDeployment, MESSAGE_STORE_DEPLOYMENT, verbose)
  grabFile(config.customerOs.messageStoreService, MESSAGE_STORE_SERVICE, verbose)
  grabFile(config.customerOs.messageStoreLoadbalancer, MESSAGE_STORE_LOADBALANCER, verbose)
  grabFile(config.customerOs.postgresqlPersistentVolume, POSTGRESQL_PV, verbose)
  grabFile(config.customerOs.postgresqlPersistentVolumeClaim, POSTGRESQL_PVC, verbose)
  grabFile(config.customerOs.postgresqlHelmValues, POSTGRESQL_HELM_VALUES, verbose)
  grabFile(config.customerOs.postgresqlSetup, POSTGRESQL_DB_SETUP, verbose)
  grabFile(config.customerOs.neo4jHelmValues, NEO4J_HELM_VALUES, verbose)
  grabFile(config.customerOs.neo4jCypher, NEO4J_CYPHER, verbose)
  grabFile(config.customerOs.neo4jProvisioning, NEO4J_DB_SETUP, verbose)
  grabFile(config.customerOs.fusionauthHelmValues, FUSIONAUTH_HELM_VALUES, verbose)

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
      error.logError(error, 'Unable to modify config files to use specified image version', true)
    }
  }

  return true
}



function customerOsInstall(verbose :boolean, imageVersion = 'latest') :boolean {
  const ns = createNamespace(verbose)
  if (!ns) return false

  const neo = installNeo4j(verbose)
  if (!neo) return false

  const sql = installPostgresql(verbose)
  if (!sql) return false

  const auth = installFusionAuth(verbose)
  if (!auth) return false

  const cos = deployCustomerOs(verbose, imageVersion)
  if (!cos) return false

  const ms = deployMessageStore(verbose, imageVersion)
  if (!ms) return false

  return true
}



function provisionPostgresql(verbose :boolean) :boolean {
  const result = true
  const sqlUser = 'openline'
  const sqlDb = 'openline'
  const sqlPw = 'password'

  let ms = ''
  let retry = 1
  const maxAttempts = config.server.timeOuts / 10
  while (ms === '') {
    if (retry < maxAttempts) {
      if (verbose) {
        console.log(`⏳ message store service starting up, please wait... ${retry}/${maxAttempts}`)
      }

      shell.exec('sleep 2')
      ms = shell.exec("kubectl get pods -n openline|grep message-store|grep Running| cut -f1 -d ' '", {silent: !verbose}).stdout
      retry++
    } else {
      error.logError('Provisioning postgreSQL timed out', 'To retry, re-run => openline dev start', true)
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
      error.logError('Provisioning postgreSQL timed out', 'To retry, re-run => openline dev start', true)
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
      error.logError('Provisioning message store DB timed out', 'To retry, re-run => openline dev start', true)
      return false
    }
  }

  return result
}
