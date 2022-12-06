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

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion)
    if (!tag) return false
  }

  let image: string | null = config.voice.kamailio.Image + imageVersion

  if (location !== config.setupDir) {
    // come back to this when Dockerfiles are standardized
    const buildPath = location + '/packages/server/kamailio'
    buildLocalImage(buildPath, image, verbose)
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
    buildLocalImage(buildPath, image, verbose)
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
    buildLocalImage(buildPath, image, verbose)
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

export function pingKamailio() :boolean {
  return shell.exec('curl localhost:8080', {silent: true}).code === 0
}
