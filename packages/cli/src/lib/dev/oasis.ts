import * as shell from 'shelljs'
import {getConfig} from '../../config/dev'
import {deployImage, Yaml, updateImageTag} from './deploy'
import {buildLocalImage} from './build-image'
import {logTerminal} from '../logs'

const config = getConfig()
const NAMESPACE = config.namespace.name
const CHANNELS_API = 'channels-api-service'
const OASIS_API = 'oasis-api-service'
const OASIS_GUI = 'oasis-gui-service'

function channelsApiCheck() :boolean {
  return (shell.exec(`kubectl get service ${CHANNELS_API} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

function oasisApiCheck() :boolean {
  return (shell.exec(`kubectl get service ${OASIS_API} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

function oasisGuiCheck() :boolean {
  return (shell.exec(`kubectl get service ${OASIS_GUI} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

export function installChannelsApi(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  if (channelsApiCheck()) return true
  const DEPLOYMENT = location + config.oasis.channelsApiDeployment
  const SERVICE = location + config.oasis.channelsApiService
  const LOADBALANCER = location + config.oasis.channelsApiLoadbalancer

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion)
    if (!tag) return false
  }

  let image: string | null = config.oasis.channelsApiImage + imageVersion

  if (location !== config.setupDir) {
    // come back to this when Dockerfiles are standardized
    const buildPath = location + '/packages/server/channels-api'
    buildLocalImage(buildPath, buildPath + '/../', image, verbose)
    image = null
  }

  const installConfig: Yaml = {
    deployYaml: DEPLOYMENT,
    serviceYaml: SERVICE,
    loadbalancerYaml: LOADBALANCER,
  }
  const deploy = deployImage(image, installConfig, verbose)
  if (deploy === false) return false

  logTerminal('SUCCESS', 'channels-api successfully installed')
  return true
}

export function installOasisApi(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  if (oasisApiCheck()) return true
  const DEPLOYMENT = location + config.oasis.apiDeployment
  const SERVICE = location + config.oasis.apiService
  const LOADBALANCER = location + config.oasis.apiLoadbalancer

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion)
    if (!tag) return false
  }

  let image: string | null = config.oasis.apiImage + imageVersion

  if (location !== config.setupDir) {
    // come back to this when Dockerfiles are cleaned up
    const buildPath = location + '/packages/server/oasis-api'
    buildLocalImage(buildPath, buildPath + '/../', image, verbose)
    image = null
  }

  const installConfig: Yaml = {
    deployYaml: DEPLOYMENT,
    serviceYaml: SERVICE,
    loadbalancerYaml: LOADBALANCER,
  }

  const deploy = deployImage(image, installConfig, verbose)
  if (deploy === false) return false

  logTerminal('SUCCESS', 'oasis-api successfully installed')
  return true
}

export function installOasisGui(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  if (oasisGuiCheck()) return true
  const DEPLOYMENT = location + config.oasis.guiDeployment
  const SERVICE = location + config.oasis.guiService
  const LOADBALANCER = location + config.oasis.guiLoadbalancer

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion)
    if (!tag) return false
  }

  let image: string | null = config.oasis.guiImage + imageVersion

  if (location !== config.setupDir) {
    // come back to this when Dockerfiles are cleaned up
    const buildPath = location + '/packages/apps/oasis/oasis-frontend'
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

  logTerminal('SUCCESS', 'oasis-gui successfully installed')
  return true
}

export function pingChannelsApi() :boolean {
  return shell.exec('curl localhost:8013/health', {silent: true}).code === 0
}

export function pingOasisApi() :boolean {
  return shell.exec('curl localhost:8006/health', {silent: true}).code === 0
}

export function pingOasisGui() :boolean {
  return shell.exec('curl localhost:3006', {silent: true}).code === 0
}
