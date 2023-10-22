import * as shell from 'shelljs'
import {getConfig} from '../../config/dev'
import {logTerminal} from '../logs'
import {exit} from 'node:process'
import {exec} from "shelljs";
import {waitForFileToBeDownloaded} from "../../helpers/downloadChecker";

const config = getConfig()
const NAMESPACE = config.namespace.name
const REDIS_SERVICE = 'customer-db-redis'
const CLI_RAW_REPO = config.cli.rawRepo

function redisServiceCheck() :boolean {
  return (shell.exec(`kubectl get service ${REDIS_SERVICE}-master -n ${NAMESPACE}`, {silent: true}).code === 0)
}

export function installRedis(verbose: boolean, location = config.setupDir) :boolean {
  if (!deployRedis(verbose, location)) return false
  return true
}

function deployRedis(verbose: boolean, location = config.setupDir) {
  if (redisServiceCheck()) return true

  const helmAdd = 'helm repo add bitnami https://charts.bitnami.com/bitnami'
  if (verbose) logTerminal('EXEC', helmAdd)
  shell.exec(helmAdd, {silent: true})

  const helmInstall = `helm install -n ${NAMESPACE} --set auth.enabled=false  --set architecture=standalone ${REDIS_SERVICE} bitnami/redis --namespace ${NAMESPACE}`
  if (verbose) logTerminal('EXEC', helmInstall)
  const redis = shell.exec(helmInstall, {silent: !verbose})
  if (redis.code !== 0) {
    logTerminal('ERROR', redis.stderr)
    exit(1)
  }

  return true
}

export function provisionRedis(verbose: boolean, location = config.setupDir) :boolean {

  let ms = ''
  let retry = 1
  const maxAttempts = config.server.timeOuts / 5

  let cosDb = ''
  while (cosDb === '') {
    if (retry < maxAttempts) {
      if (verbose) logTerminal('INFO', `redis database starting up, please wait... ${retry}/${maxAttempts}`)
      shell.exec('sleep 2')
      cosDb = shell.exec(`kubectl get pods -n ${NAMESPACE}|grep ${REDIS_SERVICE}|grep Running| cut -f1 -d ' '`, {silent: true}).stdout
      retry++
    } else {
      logTerminal('ERROR', 'Provisioning redis timed out', 'dev:redis:provisionRedis')
      return false
    }
  }

  cosDb = cosDb.slice(0, -1)
  if (verbose) logTerminal('INFO', `connecting to ${cosDb} pod`)
  const REDIS_DB_SETUP = CLI_RAW_REPO + config.customerOs.redisSetup
  const redisDbSetupFileName = waitForFileToBeDownloaded(REDIS_DB_SETUP, verbose);
  let provision = ''
  while (provision === '') {
    if (retry < maxAttempts) {
      if (verbose) logTerminal('INFO', `attempting to provision redis db, please wait... ${retry}/${maxAttempts}`)
      shell.exec('sleep 2')
      provision = shell.exec(`echo ${redisDbSetupFileName}|xargs cat|kubectl exec -n ${NAMESPACE} -i ${cosDb} -- redis-cli`, {silent: false}).stdout
      retry++
    } else {
      logTerminal('ERROR', 'Provisioning redis DB timed out', 'dev:redis:provisionRedis')
      return false
    }
  }

  if (verbose) logTerminal('SUCCESS', 'Redis database successfully provisioned')
  return true
}

export function uninstallRedis(verbose:boolean) :boolean {
  const helmUninstall = `helm uninstall ${REDIS_SERVICE} --namespace ${NAMESPACE}`
  if (verbose) logTerminal('EXEC', helmUninstall)
  const result = shell.exec(helmUninstall, {silent: !verbose})
  if (result.code === 0) {
    logTerminal('SUCCESS', 'REDIS successfully uninstalled')
  } else {
    logTerminal('ERROR', result.stderr, 'dev:redis:uninstallRedis')
    return false
  }

  return true
}
