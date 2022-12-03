import * as shell from 'shelljs'
import * as replace from 'replace-in-file'
import {getConfig} from '../../config/dev'
import {logTerminal} from '../logs'
import {exit} from 'node:process'

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
  if (verbose) logTerminal('EXEC', helmAdd)
  shell.exec(helmAdd, {silent: true})

  const helmInstall = `helm install ${NEO4J_SERVICE} neo4j/neo4j-standalone --set volumes.data.mode=defaultStorageClass -f ${HELM_VALUES_PATH} --namespace ${NAMESPACE}`
  if (verbose) logTerminal('EXEC', helmInstall)
  const neoInstall = shell.exec(helmInstall, {silent: !verbose})
  if (neoInstall.code !== 0) {
    logTerminal('ERROR', neoInstall.stderr, 'dev:neo4j:installNeo4j')
    exit(1)
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
      if (verbose) logTerminal('INFO', `Neo4j starting up, please wait... ${retry}/${maxAttempts}`)
      shell.exec('sleep 2')
      neo = shell.exec(`kubectl get pods -n ${NAMESPACE}|grep ${NEO4J_SERVICE}|grep Running|cut -f1 -d ' '`, {silent: true}).stdout
      retry++
    } else {
      logTerminal('ERROR', 'Provisioning Neo4j timed out', 'dev:neo4j:provionNeo4j')
      return false
    }
  }

  let started = ''
  while (!started.includes('password')) {
    if (retry < maxAttempts) {
      if (verbose) logTerminal('INFO', `Neo4j initializing, please wait... ${retry}/${maxAttempts}`)
      shell.exec('sleep 2')
      started = shell.exec(`kubectl logs -n ${NAMESPACE} ${neo}`, {silent: true}).stdout
      retry++
    } else {
      logTerminal('ERROR', 'Provisioning Neo4j timed out', 'dev:neo4j:provionNeo4j')
      return false
    }
  }

  updateCypherLocation(NEO4J_DB_SETUP, CYPHER, verbose)
  shell.exec(`chmod u+x ${NEO4J_DB_SETUP}`)
  const provisionNeo = shell.exec(`${NEO4J_DB_SETUP}`)
  if (provisionNeo.code !== 0) {
    logTerminal('ERROR', provisionNeo.stderr, 'dev:neo4j:provionNeo4j')
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

  logTerminal('SUCCESS', 'neo4j database successfully provisioned')
  return true
}

export function uninstallNeo4j(verbose:boolean) :boolean {
  const helmUninstall = `helm uninstall ${NEO4J_SERVICE} --namespace ${NAMESPACE}`
  if (verbose) logTerminal('EXEC', helmUninstall)
  const result = shell.exec(helmUninstall, {silent: true})
  if (result.code === 0) {
    logTerminal('SUCCESS', 'Neo4j successfully uninstalled')
  } else {
    logTerminal('ERROR', result.stderr, 'dev:neo4j:uninstallNeo4j')
    return false
  }

  return true
}
