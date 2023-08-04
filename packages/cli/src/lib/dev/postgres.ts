import * as shell from 'shelljs'
import {getConfig} from '../../config/dev'
import {logTerminal} from '../logs'
import {exit} from 'node:process'

const config = getConfig()
const NAMESPACE = config.namespace.name
const POSTGRESQL_SERVICE = 'customer-db-postgresql'
const PERSISTENT_VOLUME = 'customer-db-postgresql'
const PERSISTENT_VOLUME_CLAIM = 'customer-db-postgresql-claim'

function postgresqlServiceCheck() :boolean {
  return (shell.exec(`kubectl get service ${POSTGRESQL_SERVICE} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

function postgresqlPersistentVolumeCheck() :boolean {
  return (shell.exec(`kubectl get pv ${PERSISTENT_VOLUME} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

function postgresqlPersistentVolumeClaimCheck() :boolean {
  return (shell.exec(`kubectl get pvc ${PERSISTENT_VOLUME_CLAIM} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

export function installPostgresql(verbose: boolean, location = config.setupDir) :boolean {
  if (!setupPersistentVolume(verbose, location)) return false
  if (!setupPersistentVolumeClaim(verbose, location)) return false
  if (!deployPostgresql(verbose, location)) return false
  return true
}

function setupPersistentVolume(verbose: boolean, location = config.setupDir) : boolean {
  if (postgresqlPersistentVolumeCheck()) return true
  const PERSISTENT_VOLUME_PATH = location + config.customerOs.postgresqlPersistentVolume

  const kubePV = `kubectl apply -f ${PERSISTENT_VOLUME_PATH} --namespace ${NAMESPACE}`
  if (verbose) logTerminal('EXEC', kubePV)
  const pv = shell.exec(kubePV, {silent: !verbose})
  if (pv.code !== 0) {
    logTerminal('ERROR', pv.stderr, 'dev:postgres:setupPersistentVolume')
    exit(1)
  }

  return true
}

function setupPersistentVolumeClaim(verbose: boolean, location = config.setupDir) :boolean {
  if (postgresqlPersistentVolumeClaimCheck()) return true
  const PERSISTENT_VOLUME_CLAIM_PATH = location + config.customerOs.postgresqlPersistentVolumeClaim

  const kubePVC = `kubectl apply -f ${PERSISTENT_VOLUME_CLAIM_PATH} --namespace ${NAMESPACE}`
  if (verbose) logTerminal('EXEC', kubePVC)
  const pvc = shell.exec(kubePVC, {silent: !verbose})
  if (pvc.code !== 0) {
    logTerminal('ERROR', pvc.stderr, 'dev:postgres:setupPersistentVolumeClaim')
    exit(1)
  }

  return true
}

function deployPostgresql(verbose: boolean, location = config.setupDir) {
  if (postgresqlServiceCheck()) return true
  const HELM_VALUES_PATH = location + config.customerOs.postgresqlHelmValues

  const helmAdd = 'helm repo add bitnami https://charts.bitnami.com/bitnami'
  if (verbose) logTerminal('EXEC', helmAdd)
  shell.exec(helmAdd, {silent: true})

  const helmInstall = `helm install --values ${HELM_VALUES_PATH} ${POSTGRESQL_SERVICE} bitnami/postgresql --namespace ${NAMESPACE}`
  if (verbose) logTerminal('EXEC', helmInstall)
  const postgresql = shell.exec(helmInstall, {silent: !verbose})
  if (postgresql.code !== 0) {
    logTerminal('ERROR', postgresql.stderr)
    exit(1)
  }

  return true
}

export function provisionPostgresql(verbose: boolean, location = config.setupDir) :boolean {
  const sqlUser = 'openline'
  const sqlDb = 'openline'
  const sqlPw = 'password'
  const POSTGRESQL_DB_SETUP = location + config.customerOs.postgresqlSetup

  let ms = ''
  let retry = 1
  const maxAttempts = config.server.timeOuts / 5

  let cosDb = ''
  while (cosDb === '') {
    if (retry < maxAttempts) {
      if (verbose) logTerminal('INFO', `postgreSQL database starting up, please wait... ${retry}/${maxAttempts}`)
      shell.exec('sleep 2')
      cosDb = shell.exec(`kubectl get pods -n ${NAMESPACE}|grep ${POSTGRESQL_SERVICE}|grep Running| cut -f1 -d ' '`, {silent: true}).stdout
      retry++
    } else {
      logTerminal('ERROR', 'Provisioning postgreSQL timed out', 'dev:postgres:provisionPostresql')
      return false
    }
  }

  cosDb = cosDb.slice(0, -1)

  if (verbose) logTerminal('INFO', `connecting to ${cosDb} pod`)

  let provision = ''
  while (provision === '') {
    if (retry < maxAttempts) {
      if (verbose) logTerminal('INFO', `attempting to provision message store db, please wait... ${retry}/${maxAttempts}`)
      shell.exec('sleep 2')
      provision = shell.exec(`echo ${POSTGRESQL_DB_SETUP}|xargs cat|kubectl exec -n ${NAMESPACE} -i ${cosDb} -- /bin/bash -c "PGPASSWORD=${sqlPw} psql -U ${sqlUser} ${sqlDb}"`, {silent: false}).stdout
      retry++
    } else {
      logTerminal('ERROR', 'Provisioning message store DB timed out', 'dev:postgres:provisionPostresql')
      return false
    }
  }

  if (verbose) logTerminal('SUCCESS', 'PostgreSQL database successfully provisioned')
  return true
}

export function uninstallPostgresql(verbose:boolean) :boolean {
  const helmUninstall = `helm uninstall ${POSTGRESQL_SERVICE} --namespace ${NAMESPACE}`
  const result = shell.exec(helmUninstall, {silent: !verbose})
  if (result.code === 0) {
    logTerminal('SUCCESS', 'PostgreSQL successfully uninstalled')
  } else {
    logTerminal('ERROR', result.stderr, 'dev:postgres:uninstallPostgresql')
    return false
  }
  if (verbose) logTerminal('EXEC', helmUninstall)
  const deletePVC = `kubectl delete pvc ${PERSISTENT_VOLUME_CLAIM} --namespace ${NAMESPACE}`
  if (verbose) logTerminal('EXEC', deletePVC)
  const resultPVC = shell.exec(deletePVC, {silent: !verbose})
  if (resultPVC.code === 0) {
    logTerminal('SUCCESS', 'PostgreSQL Permanent Volume Claim successfully uninstalled ')
  } else {
    logTerminal('ERROR', result.stderr, 'dev:postgres:uninstallPostgresql')
    return false
  }
  const deletePV = `kubectl delete pv ${PERSISTENT_VOLUME} --namespace ${NAMESPACE}`
  if (verbose) logTerminal('EXEC', deletePV)
  const resultPV = shell.exec(deletePV, {silent: !verbose})
  if (resultPV.code === 0) {
    logTerminal('SUCCESS', 'PostgreSQL Permanent Volume successfully uninstalled ')
  } else {
    logTerminal('ERROR', result.stderr, 'dev:postgres:uninstallPostgresql')
    return false
  }


  return true
}
