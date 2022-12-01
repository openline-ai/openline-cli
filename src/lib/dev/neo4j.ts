import * as shell from 'shelljs'
import * as error from './errors'
import * as replace from 'replace-in-file'
import {getConfig} from '../../config/dev'

const config = getConfig()
const NAMESPACE = config.namespace.name
const NEO4J_SERVICE = 'neo4j-customer-os'

function neo4jCheck() :boolean {
  return (shell.exec(`kubectl get service ${NEO4J_SERVICE} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

export function installNeo4j(verbose :boolean, location = config.setupDir) :boolean {
  if (neo4jCheck()) return true
  const HELM_VALUES_PATH = location + config.customerOs.neo4jHelmValues

  const helmAdd = 'helm repo add neo4j https://helm.neo4j.com/neo4j'
  if (verbose) console.log(`[EXEC] ${helmAdd}`)
  shell.exec(helmAdd, {silent: !verbose})

  const helmInstall = `helm install ${NEO4J_SERVICE} neo4j/neo4j-standalone --set volumes.data.mode=defaultStorageClass -f ${HELM_VALUES_PATH} --namespace ${NAMESPACE}`
  if (verbose) console.log(`[EXEC] ${helmInstall}`)
  const neoInstall = shell.exec(helmInstall, {silent: !verbose})
  if (neoInstall.code !== 0) {
    error.logError(neoInstall.stderr, 'Unable to complete helm install of neo4j-standalone', true)
    return false
  }

  return true
}

export function provisionNeo4j(verbose :boolean, location = config.setupDir) :boolean {
  let neo = ''
  let retry = 1
  const maxAttempts = config.server.timeOuts / 2
  const NEO4J_DB_SETUP = location + config.customerOs.neo4jProvisioning
  const CYPHER = location + config.customerOs.neo4jCypher

  while (neo === '') {
    if (retry < maxAttempts) {
      if (verbose) {
        console.log(`⏳ Neo4j starting up, please wait... ${retry}/${maxAttempts}`)
      }

      shell.exec('sleep 2')
      neo = shell.exec(`kubectl get pods -n ${NAMESPACE}|grep ${NEO4J_SERVICE}|grep Running|cut -f1 -d ' '`, {silent: !verbose}).stdout
      retry++
    } else {
      error.logError('Provisioning Neo4j timed out', 'To retry, re-run => openline dev start', true)
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
      started = shell.exec(`kubectl logs -n ${NAMESPACE} ${neo}`, {silent: !verbose}).stdout
      retry++
    } else {
      error.logError('Provisioning Neo4j timed out', 'To retry, re-run => openline dev start', true)
      return false
    }
  }

  if (verbose) {
    console.log('⏳ provisioning Neo4j, please wait...')
  }

  updateCypherLocation(NEO4J_DB_SETUP, CYPHER, verbose)
  shell.exec(`chmod u+x ${NEO4J_DB_SETUP}`)
  const provisionNeo = shell.exec(`${NEO4J_DB_SETUP}`)
  if (provisionNeo.code !== 0) {
    error.logError(provisionNeo.stderr, 'Neo4j provisioning failed.', true)
    return false
  }

  return true
}

function updateCypherLocation(scriptLoc: string, cypherLoc: string, verbose: boolean) :boolean {
  const options = {
    files: scriptLoc,
    from: './openline-setup/customer-os.cypher',
    to: cypherLoc,
  }
  try {
    const textReplace = replace.sync(options)
    if (verbose) {
      console.log('Replacement results:', textReplace)
    }
  } catch (error: any) {
    error.logError(error, 'Unable to modify config files to use specified image version', true)
    return false
  }

  return true
}

export function uninstallNeo4j(verbose:boolean) :boolean {
  const helmUninstall = `helm uninstall ${NEO4J_SERVICE} --namespace ${NAMESPACE}`
  if (verbose) console.log(`[EXEC] ${helmUninstall}`)
  const result = shell.exec(helmUninstall, {silent: !verbose})
  if (result.code !== 0) {
    error.logError(result.stderr, 'Unable to helm uninstall Neo4j database')
    return false
  }

  return true
}