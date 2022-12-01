import * as shell from 'shelljs'
import * as error from './errors'
import {getConfig} from '../../config/dev'
import {deployImage, Yaml, updateImageTag} from './deploy'
import {buildLocalImage} from './build-image'

const config = getConfig()
const NAMESPACE = config.namespace.name
const CHANNELS_API = 'channels-api-service'
const OASIS_API = 'oasis-api-service'
const OASIS_GUI = 'oasis-frontend-service'

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
  const CHANNELS_API_IMAGE = 'channels-api'
  const DEPLOYMENT = location + config.oasis.channelsApiDeployment
  const SERVICE = location + config.oasis.channelsApiService
  const LOADBALANCER = location + config.oasis.channelsApiLoadbalancer

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion, verbose)
    if (!tag) return false
  }

  let image: string | null = config.oasis.channelsApiImage + imageVersion

  if (location !== config.setupDir) {
    const buildPath = location + '/packages/server/channels-api'
    buildLocalImage(buildPath, CHANNELS_API_IMAGE, verbose)
    image = null
  }

  const installConfig: Yaml = {
    deployYaml: DEPLOYMENT,
    serviceYaml: SERVICE,
    loadbalancerYaml: LOADBALANCER,
  }
  const deploy = deployImage(image, installConfig, verbose)
  if (deploy === false) {
    error.logError('Error loading image', 'Unable to deploy Channels API', true)
    return false
  }

  return true
}

export function installOasisApi(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  if (oasisApiCheck()) return true
  const OASIS_API_IMAGE = 'oasis-api'
  const DEPLOYMENT = location + config.oasis.apiDeployment
  const SERVICE = location + config.oasis.apiService
  const LOADBALANCER = location + config.oasis.apiLoadbalancer

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion, verbose)
    if (!tag) return false
  }

  let image: string | null = config.oasis.apiImage + imageVersion

  if (location !== config.setupDir) {
    const buildPath = location + '/packages/server/oasis-api'
    buildLocalImage(buildPath, OASIS_API_IMAGE, verbose)
    image = null
  }

  const installConfig: Yaml = {
    deployYaml: DEPLOYMENT,
    serviceYaml: SERVICE,
    loadbalancerYaml: LOADBALANCER,
  }

  const deploy = deployImage(image, installConfig, verbose)
  if (deploy === false) {
    error.logError('Error deploying image', 'Unable to deploy Oasis API', true)
    return false
  }

  return true
}

export function installOasisGui(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  if (oasisGuiCheck()) return true
  const OASIS_GUI_IMAGE = 'oasis-frontend-dev'
  const DEPLOYMENT = location + config.oasis.guiDeployment
  const SERVICE = location + config.oasis.guiService
  const LOADBALANCER = location + config.oasis.guiLoadbalancer

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion, verbose)
    if (!tag) return false
  }

  let image: string | null = config.oasis.guiImage + imageVersion

  if (location !== config.setupDir) {
    const buildPath = location + '/packages/apps/oasis/oasis-frontend'
    buildLocalImage(buildPath, OASIS_GUI_IMAGE, verbose)
    image = null
  }

  const installConfig: Yaml = {
    deployYaml: DEPLOYMENT,
    serviceYaml: SERVICE,
    loadbalancerYaml: LOADBALANCER,
  }
  const deploy = deployImage(image, installConfig, verbose)
  if (deploy === false) {
    error.logError('Error loading image', 'Unable to deploy Oasis GUI', true)
    return false
  }

  return true
}