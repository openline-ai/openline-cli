import * as shell from 'shelljs'
import {getConfig} from '../../config/dev'
import {logTerminal} from '../logs'
import {exit} from 'node:process'

const config = getConfig()
const NAMESPACE = config.namespace.name
const NEO4J_RELEASE_NAME = 'customer-db-neo4j'
const NEO4J_POD = 'customer-db-neo4j-0'
const NEO4J_NAME = 'openline-neo4j-db'

function neo4jCheck() :boolean {
  return (shell.exec(`kubectl get service ${NEO4J_RELEASE_NAME} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

export function installNeo4j(verbose :boolean, location = config.setupDir) :boolean {
  if (neo4jCheck()) return true
  const HELM_VALUES_PATH = location + config.customerOs.neo4jHelmValues

  const helmAdd = 'helm repo add neo4j https://helm.neo4j.com/neo4j --force-update'
  if (verbose) logTerminal('EXEC', helmAdd)
  shell.exec(helmAdd, {silent: true})

  const helmInstall = `helm upgrade --install ${NEO4J_RELEASE_NAME} neo4j/neo4j --set volumes.data.mode=defaultStorageClass --set "neo4j.name=${NEO4J_NAME}" -f ${HELM_VALUES_PATH} --namespace ${NAMESPACE}`
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
  const NEO4J_CYPHER = location + config.customerOs.neo4jCypher

  while (neo === '') {
    if (retry < maxAttempts) {
      if (verbose) logTerminal('INFO', `Neo4j starting up, please wait... ${retry}/${maxAttempts}`)
      shell.exec('sleep 2')
      neo = shell.exec(`kubectl get pods -n ${NAMESPACE}|grep ${NEO4J_RELEASE_NAME}|grep Running|cut -f1 -d ' '`, {silent: true}).stdout
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

  const version = shell.exec(`kubectl describe pod ${NEO4J_POD} -n ${NAMESPACE} | grep HELM_NEO4J_VERSION | tr -s ' ' | cut -d ' ' -f 3`, {silent: true}).stdout.trimEnd()
  if (verbose) logTerminal('INFO', `Neo4j version detected... ${version}`)

  let neoOutput = []
  do {
    const neoOutputFull = shell.exec(`cat ${NEO4J_CYPHER} |kubectl run --rm -i --namespace ${NAMESPACE} --image "neo4j:${version}" cypher-shell  -- bash -c 'NEO4J_PASSWORD=StrongLocalPa\\$\\$ cypher-shell -a neo4j://${NEO4J_RELEASE_NAME}.openline.svc.cluster.local:7687 -u neo4j --non-interactive'`, {silent: true}).stderr.split(/\r?\n/)
    neoOutput = neoOutputFull.filter(function (line) {
      return !(line.includes('see a command prompt') || line === '')
    })
    if (neoOutput.length > 0) {
      retry++
      shell.exec(`kubectl delete pod cypher-shell -n ${NAMESPACE}`, {silent: true})
      shell.exec('sleep 2')
      if (verbose) logTerminal('INFO', `Neo4j provisioning attempt failed reason = ${JSON.stringify(neoOutput)} retrying... ${retry}/${maxAttempts}`)
    }
  } while (neoOutput.length > 0)

  const demoTenant = `curl -s --location --request GET '127.0.0.1:4001/demo-tenant' \
  --header 'X-Openline-Api-Key: cad7ccb6-d8ff-4bae-a048-a42db33a217e' \
  --header 'TENANT_NAME: openline' \
  --header 'MASTER_USERNAME: development@openline.ai' \
  --form 'file=@"https://github.com/openline-ai/openline-cli/blob/otter/resources/demo-tenant.json"'`;

  const { code, stdout, stderr } = shell.exec(demoTenant);

  if (code !== 0) {
    console.error(`Error: ${stderr}`);
  } else {
    console.log(`Response: ${stdout}`);
  }

  logTerminal('SUCCESS', 'neo4j database successfully provisioned')
  return true
}

export function uninstallNeo4j(verbose:boolean) :boolean {
  const helmUninstall = `helm uninstall ${NEO4J_RELEASE_NAME} --namespace ${NAMESPACE}`
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
