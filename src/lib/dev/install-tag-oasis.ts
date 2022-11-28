import * as shell from 'shelljs'
import * as error from './errors'
import * as replace from 'replace-in-file'
import {getConfig} from '../../config/dev'
import {deployImage, grabFile, Yaml} from './deploy'

const config = getConfig()
const SETUP_PATH = 'openline-setup'

// Oasis API config
const API_DEPLOYMENT = SETUP_PATH + '/oasis-api-deployment.yaml'
const API_SERVICE = SETUP_PATH + '/oasis-api-service.yaml'
const API_LOADBALANCER = SETUP_PATH + '/oasis-api-loadbalancer.yaml'

// Channels API config
const CHANNELS_DEPLOYMENT = SETUP_PATH + '/channels-api-deployment.yaml'
const CHANNELS_SERVICE = SETUP_PATH + '/channels-api-service.yaml'
const CHANNELS_LOADBALANCER = SETUP_PATH + '/channels-api-loadbalancer.yaml'

// Oasis GUI config
const GUI_DEPLOYMENT = SETUP_PATH + '/oasis-gui-deployment.yaml'
const GUI_SERVICE = SETUP_PATH + '/oasis-gui-service.yaml'
const GUI_LOADBALANCER = SETUP_PATH + '/oasis-gui-loadbalancer.yaml'

export function installOasis(verbose :boolean, imageVersion = 'latest') :boolean {
  shell.exec(`mkdir ${SETUP_PATH}`)

  const setup = getSetupFiles(verbose, imageVersion)
  if (!setup) {
    return false
  }

  const deploy = deployOasis(verbose, imageVersion)
  if (!deploy) {
    return false
  }

  shell.exec(`rm -r ${SETUP_PATH}`)

  return true
}

function getSetupFiles(verbose :boolean, imageVersion = 'latest') :boolean {
  grabFile(config.oasis.apiDeployment, `${API_DEPLOYMENT}`, verbose)
  grabFile(config.oasis.apiService, `${API_SERVICE}`, verbose)
  grabFile(config.oasis.apiLoadbalancer, `${API_LOADBALANCER}`, verbose)
  grabFile(config.oasis.channelsApiDeployment, `${CHANNELS_DEPLOYMENT}`, verbose)
  grabFile(config.oasis.channelsApiService, `${CHANNELS_SERVICE}`, verbose)
  grabFile(config.oasis.channelsApiLoadbalancer, `${CHANNELS_LOADBALANCER}`, verbose)
  grabFile(config.oasis.guiDeployment, `${GUI_DEPLOYMENT}`, verbose)
  grabFile(config.oasis.guiService, `${GUI_SERVICE}`, verbose)
  grabFile(config.oasis.guiLoadbalancer, `${GUI_LOADBALANCER}`, verbose)

  if (imageVersion !== 'latest') {
    const options = {
      files: [
        `./${API_DEPLOYMENT}`,
        `./${CHANNELS_DEPLOYMENT}`,
        `./${GUI_DEPLOYMENT}`,
      ],
      from: 'latest',
      to: imageVersion,
    }
    try {
      const textReplace = replace.sync(options)
      if (verbose) {
        console.log('Replacement results:', textReplace)
      }
    } catch (error: any) {
      error.logError(error, 'Unable to modify config files to use specified image version')
    }
  }

  return true
}

function deployOasis(verbose :boolean, imageVersion = 'latest') :boolean {
  // deploy Oasis API
  // eslint-disable-next-line unicorn/prefer-spread
  const apiImage = (config.oasis.apiImage.concat(imageVersion))
  const oasisApi: Yaml = {
    deployYaml: `./${API_DEPLOYMENT}`,
    serviceYaml: `./${API_SERVICE}`,
    loadbalancerYaml: `./${API_LOADBALANCER}`,
  }

  const apiDeploy = deployImage(apiImage, oasisApi, verbose)
  if (!apiDeploy) {
    error.logError('Error loading image', 'Unable to deploy Oasis API')
    return false
  }

  // deploy Channels API
  // eslint-disable-next-line unicorn/prefer-spread
  const channelsImage = (config.oasis.channelsApiImage.concat(imageVersion))
  const channelsApi: Yaml = {
    deployYaml: `./${CHANNELS_DEPLOYMENT}`,
    serviceYaml: `./${CHANNELS_SERVICE}`,
    loadbalancerYaml: `./${CHANNELS_LOADBALANCER}`,
  }

  const channelsDeploy = deployImage(channelsImage, channelsApi, verbose)
  if (!channelsDeploy) {
    error.logError('Error loading image', 'Unable to deploy Oasis Channels API')
    return false
  }

  // deploy Oasis GUI
  // eslint-disable-next-line unicorn/prefer-spread
  const guiImage = (config.oasis.guiImage.concat(imageVersion))
  const gui: Yaml = {
    deployYaml: `${GUI_DEPLOYMENT}`,
    serviceYaml: `${GUI_SERVICE}`,
    loadbalancerYaml: `${GUI_LOADBALANCER}`,
  }

  const guiDeploy = deployImage(guiImage, gui, verbose)
  if (!guiDeploy) {
    error.logError('Error loading image', 'Unable to deploy Oasis GUI')
    return false
  }

  return true
}
