import * as shell from 'shelljs'
import * as error from './errors'
import {getConfig} from '../../config/dev'
import {logTerminal} from '../logs'

const config = getConfig()
const NAMESPACE = config.namespace.name
const POSTGRESQL_SERVICE = 'postgresql-customer-os-dev'
const PERSISTENT_VOLUME = 'postgresql-customer-os-data'
const PERSISTENT_VOLUME_CLAIM = 'efs-postgresql-claim'

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
  if (verbose) console.log(`[EXEC] ${kubePV}`)
  const pv = shell.exec(kubePV, {silent: !verbose})
  if (pv.code !== 0) {
    error.logError(pv.stderr, 'Unable to setup postgreSQL persistent volume', true)
    return false
  }

  return true
}

function setupPersistentVolumeClaim(verbose: boolean, location = config.setupDir) :boolean {
  if (postgresqlPersistentVolumeClaimCheck()) return true
  const PERSISTENT_VOLUME_CLAIM_PATH = location + config.customerOs.postgresqlPersistentVolumeClaim

  const kubePVC = `kubectl apply -f ${PERSISTENT_VOLUME_CLAIM_PATH} --namespace ${NAMESPACE}`
  if (verbose) console.log(`[EXEC] ${kubePVC}`)
  const pvc = shell.exec(kubePVC, {silent: !verbose})
  if (pvc.code !== 0) {
    error.logError(pvc.stderr, 'Unable to setup postgreSQL persistent volume claim', true)
    return false
  }

  return true
}

function deployPostgresql(verbose: boolean, location = config.setupDir) {
  if (postgresqlServiceCheck()) return true
  const HELM_VALUES_PATH = location + config.customerOs.postgresqlHelmValues

  const helmAdd = 'helm repo add bitnami https://charts.bitnami.com/bitnami'
  if (verbose) console.log(`[EXEC] ${helmAdd}`)
  shell.exec(helmAdd, {silent: !verbose})

  const helmInstall = `helm install --values ${HELM_VALUES_PATH} ${POSTGRESQL_SERVICE} bitnami/postgresql --namespace ${NAMESPACE}`
  if (verbose) console.log(`[EXEC] ${helmInstall}`)
  const postgresql = shell.exec(helmInstall, {silent: !verbose})
  if (postgresql.code !== 0) {
    error.logError(postgresql.stderr, 'Unable to complete helm install of postgresql', true)
    return false
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
  while (ms === '') {
    if (retry < maxAttempts) {
      if (verbose) {
        console.log(`⏳ postgreSQL database starting up, please wait... ${retry}/${maxAttempts}`)
      }

      shell.exec('sleep 2')
      ms = shell.exec(`kubectl get pods -n ${NAMESPACE}|grep message-store|grep Running| cut -f1 -d ' '`, {silent: !verbose}).stdout
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
        console.log(`⏳ postgreSQL database starting up, please wait... ${retry}/${maxAttempts}`)
      }

      shell.exec('sleep 2')
      cosDb = shell.exec(`kubectl get pods -n ${NAMESPACE}|grep ${POSTGRESQL_SERVICE}|grep Running| cut -f1 -d ' '`, {silent: !verbose}).stdout
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
      provision = shell.exec(`echo ${POSTGRESQL_DB_SETUP}|xargs cat|kubectl exec -n ${NAMESPACE} -i ${cosDb} -- /bin/bash -c "PGPASSWORD=${sqlPw} psql -U ${sqlUser} ${sqlDb}"`, {silent: !verbose}).stdout
      retry++
    } else {
      error.logError('Provisioning message store DB timed out', 'To retry, re-run => openline dev start', true)
      return false
    }
  }

  return true
}

export function uninstallPostgresql(verbose:boolean) :boolean {
  const helmUninstall = `helm uninstall ${POSTGRESQL_SERVICE} --namespace ${NAMESPACE}`
  if (verbose) logTerminal('EXEC', helmUninstall)
  const result = shell.exec(helmUninstall, {silent: !verbose})
  if (result.code === 0) {
    logTerminal('SUCCESS', 'PostgreSQL successfully uninstalled')
  } else {
    logTerminal('ERROR', result.stderr, 'dev:postgres:uninstallPostgresql')
    return false
  }

  return true
}
