import * as shell from 'shelljs'
import {getConfig} from '../../config/dev'
import {deployImage, Yaml, updateImageTag} from './deploy'
import {buildLocalImage} from './build-image'
import {logTerminal} from '../logs'

const config = getConfig()
const NAMESPACE = config.namespace.name
const KAMAILIO = 'kamailio-service'
const ASTERISK = 'asterisk'
const VOICE_PLUGIN = 'voice-plugin-service'

const POSTGRESQL_SERVICE = 'postgresql-customer-os-dev'


function kamailioCheck() :boolean {
  return (shell.exec(`kubectl get service ${KAMAILIO} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

function asteriskCheck() :boolean {
  return (shell.exec(`kubectl get service ${ASTERISK} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

function voicePluginCheck() :boolean {
  return (shell.exec(`kubectl get service ${VOICE_PLUGIN} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

export function installKamailio(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  if (kamailioCheck()) return true
  const DEPLOYMENT = location + config.voice.kamailio.Deployment
  const SERVICE = location + config.voice.kamailio.Service
  const LOADBALANCER = location + config.voice.kamailio.Loadbalancer

  if(!provisionPostgresql(verbose, location)) {
    return false
  }

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion)
    if (!tag) return false
  }

  let image: string | null = config.voice.kamailio.Image + imageVersion

  if (location !== config.setupDir) {
    // come back to this when Dockerfiles are standardized
    const buildPath = location + '/packages/server/kamailio'
    buildLocalImage(buildPath, buildPath, image, verbose)
    image = null
  }

  const installConfig: Yaml = {
    deployYaml: DEPLOYMENT,
    serviceYaml: SERVICE,
    loadbalancerYaml: LOADBALANCER,
  }
  const deploy = deployImage(image, installConfig, verbose)
  if (deploy === false) return false

  logTerminal('SUCCESS', 'kamailio successfully installed')
  return true
}

export function installAsterisk(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  if (asteriskCheck()) return true
  const DEPLOYMENT = location + config.voice.asterisk.Deployment
  const SERVICE = location + config.voice.asterisk.Service

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion)
    if (!tag) return false
  }

  let image: string | null = config.voice.asterisk.Image + imageVersion

  if (location !== config.setupDir) {
    // come back to this when Dockerfiles are standardized
    const buildPath = location + '/packages/server/asterisk'
    buildLocalImage(buildPath, buildPath, image, verbose)
    image = null
  }

  const installConfig: Yaml = {
    deployYaml: DEPLOYMENT,
    serviceYaml: SERVICE,
  }
  const deploy = deployImage(image, installConfig, verbose)
  if (deploy === false) return false

  logTerminal('SUCCESS', 'asterisk successfully installed')
  return true
}

export function installVoicePlugin(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  if (asteriskCheck()) return true
  const DEPLOYMENT = location + config.voice.plugin.Deployment
  const SERVICE = location + config.voice.plugin.Service

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion)
    if (!tag) return false
  }

  let image: string | null = config.voice.plugin.Image + imageVersion

  if (location !== config.setupDir) {
    // come back to this when Dockerfiles are standardized
    const buildPath = location + '/packages/apps/voice-plugin'
    buildLocalImage(buildPath, buildPath, image, verbose)
    image = null
  }

  const installConfig: Yaml = {
    deployYaml: DEPLOYMENT,
    serviceYaml: SERVICE,
  }
  const deploy = deployImage(image, installConfig, verbose)
  if (deploy === false) return false

  logTerminal('SUCCESS', 'voice-plugin successfully installed')
  return true
}

export function provisionPostgresql(verbose: boolean, location = config.setupDir) :boolean {
  const sqlUser = 'openline'
  const sqlDb = 'openline'
  const sqlPw = 'password'
  const FILES=["standard-create.sql", "permissions-create.sql", "carriers.sql"]

  let POSTGRESQL_DB_SETUP: string = ""
  for( const i in FILES) {
    POSTGRESQL_DB_SETUP = POSTGRESQL_DB_SETUP + " " + location + "/packages/server/kamailio/sql/" + FILES[i]
  }

  let ms = ''
  let retry = 1
  const maxAttempts = config.server.timeOuts / 5
  while (ms === '') {
    if (retry < maxAttempts) {
      if (verbose) logTerminal('INFO', `postgreSQL database starting up, please wait... ${retry}/${maxAttempts}`)
      ms = shell.exec(`kubectl get pods -n ${NAMESPACE}|grep message-store|grep Running| cut -f1 -d ' '`, {silent: true}).stdout
      if (ms === '') shell.exec('sleep 2')
      retry++
    } else {
      logTerminal('ERROR', 'Provisioning postgreSQL timed out', 'dev:postgres:provisionPostresql')
      return false
    }
  }

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
      if (verbose) logTerminal('INFO', `attempting to provision voice db, please wait... ${retry}/${maxAttempts}`)
      shell.exec('sleep 2')
      provision = shell.exec(`echo ${POSTGRESQL_DB_SETUP}|xargs cat|kubectl exec -n ${NAMESPACE} -i ${cosDb} -- /bin/bash -c "PGPASSWORD=${sqlPw} psql -U ${sqlUser} ${sqlDb}"`, {silent: true}).stdout
      retry++
    } else {
      logTerminal('ERROR', 'Provisioning voice DB timed out', 'dev:postgres:provisionPostresql')
      return false
    }
  }

  if (verbose) logTerminal('SUCCESS', 'PostgreSQL database successfully provisioned')
  return true
}

export function pingKamailio() :boolean {
  return shell.exec('curl localhost:8080', {silent: true}).code === 0
}
