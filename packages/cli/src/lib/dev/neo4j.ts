import * as shell from 'shelljs'
import {getConfig} from '../../config/dev'
import {logTerminal} from '../logs'
import {exit} from 'node:process'
import {
  waitForCustomerOsApiPodToBeReady,
  waitForEventsProcessingPlatformPodToBeReady,
  waitForUserAdminAppPodToBeReady
} from "./customer-os";
import * as demoTenantData from "./demo-tenant.json"

const config = getConfig()
const NAMESPACE = config.namespace.name
const NEO4J_RELEASE_NAME = 'customer-db-neo4j'
const NEO4J_POD = 'customer-db-neo4j-0'
const NEO4J_NAME = 'openline-neo4j-db'

let retry = 1
const maxAttempts = config.server.timeOuts / 2

function neo4jCheck() :boolean {
  return (shell.exec(`kubectl get service ${NEO4J_RELEASE_NAME} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

export function installNeo4j(verbose :boolean, location = config.setupDir) :boolean {
  if (neo4jCheck()) return true
  const HELM_VALUES_PATH = config.customerOs.neo4jHelmValues

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

function cypherInsert(verbose: boolean, neo4jCypherFilename: string) {
  waitForNeo4jToBeInitialized(verbose)

  const version = shell.exec(`kubectl describe pod ${NEO4J_POD} -n ${NAMESPACE} | grep HELM_NEO4J_VERSION | tr -s ' ' | cut -d ' ' -f 3`, {silent: true}).stdout.trimEnd()
  if (verbose) logTerminal('INFO', `Neo4j version detected... ${version}`)


  let neoOutput = []
  do {
    if (verbose) {
      logTerminal('INFO', `Starting the neo4j provisioning attempt... ${retry}/${maxAttempts}`)
    }
    const command = `cat ${neo4jCypherFilename} |kubectl run --rm -i --namespace ${NAMESPACE} --image "neo4j:${version}" cypher-shell  -- bash -c 'NEO4J_PASSWORD=StrongLocalPa\\$\\$ cypher-shell -a neo4j://${NEO4J_RELEASE_NAME}.openline.svc.cluster.local:7687 -u neo4j --non-interactive'`;
    if (verbose) {
      logTerminal('INFO', `Neo4j provisioning command ${command}`)
    }
    const neoOutputFull = shell.exec(command, {silent: true}).stderr.split(/\r?\n/)
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
}

export function provisionNeo4j(verbose :boolean, location = config.setupDir) :boolean {
  const NEO4J_CYPHER = config.customerOs.neo4jCypher
  const neo4jCypherFilename = NEO4J_CYPHER;

  cypherInsert(verbose, neo4jCypherFilename);

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

export function waitForNeo4jToBeInitialized(verbose:boolean) {
  logTerminal('INFO', 'Waiting for Neo4J to be initialized')
  let neo = ''
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

  if (verbose) logTerminal('SUCCESS', 'neo4j is not initialized')
}

async function runDemoTenantProvisioningScript(verbose: boolean) {
  logTerminal('INFO', 'Waiting for Neo4J to be provisioned with the demo tenant')
  const stringifiedDemoTenantData = JSON.stringify(demoTenantData);

  console.log(">>> Running users init")
  shell.exec('sleep 3')
    await initiateDemoTenant("demo-tenant-users", stringifiedDemoTenantData, verbose);
    console.log("Users successfully initiated!");

  console.log(">>> Running data init");
  shell.exec('sleep 5');
    await initiateDemoTenant("demo-tenant-data", stringifiedDemoTenantData, verbose);
    console.log("Data successfully initiated!");
}

async function initiateDemoTenant(urlPath: string, stringifiedDemoTenantData: string, verbose: boolean) {
  const formData = new FormData();
  formData.append('file', new Blob([stringifiedDemoTenantData], {type: 'application/json'}));

  try {
    const res = await fetch("http://127.0.0.1:4001/" + urlPath, {
      method: "POST",
      headers: {
        "X-Openline-Api-Key": "cad7ccb6-d8ff-4bae-a048-a42db33a217e",
        "TENANT_NAME": "openlineai",
        "MASTER_USERNAME": "edi@openline.ai",
      },
      body: formData
    })
    if (verbose) console.log(res)
  } catch (e) {
    console.error("Error:", e);
  }

}

export async function provisionNeo4jWithDemoTenant(verbose:boolean){
  waitForUserAdminAppPodToBeReady(verbose);
  waitForCustomerOsApiPodToBeReady(verbose);
  waitForEventsProcessingPlatformPodToBeReady(verbose);
  waitForNeo4jToBeInitialized(verbose)
  await runDemoTenantProvisioningScript(verbose);
}

