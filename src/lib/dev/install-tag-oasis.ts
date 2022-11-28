import * as shell from 'shelljs'
import * as error from './errors'
import * as replace from 'replace-in-file'
import {getConfig} from '../../config/dev'
import {deployImage, grabFile, Yaml} from './deploy'

const config = getConfig()
const SETUP_PATH = 'openline-setup'

export function installOasis(verbose :boolean, imageVersion = 'latest') :boolean {
  const setup = getSetupFiles(verbose, imageVersion)
  if (!setup) {
    return false
  }

  const deploy = deployOasis(verbose, imageVersion)
  if (!deploy) {
    return false
  }

  return true
}

function getSetupFiles(verbose :boolean, imageVersion = 'latest') :boolean {
  const dir = shell.exec(`mkdir ${SETUP_PATH}`)
  if (dir.code !== 0) {
    error.logError(dir.stderr, 'Could not make setup directory')
    return false
  }

  grabFile(config.oasis.channelsApiDeployment, `${SETUP_PATH}/channels-api-deployment.yaml`, verbose)
  grabFile(config.oasis.channelsApiService, `${SETUP_PATH}/channels-api-service.yaml`, verbose)
  grabFile(config.oasis.channelsApiLoadbalancer, `${SETUP_PATH}/channels-api-loadbalancer.yaml`, verbose)
  grabFile(config.oasis.apiDeployment, `${SETUP_PATH}/oasis-api-deployment.yaml`, verbose)
  grabFile(config.oasis.apiService, `${SETUP_PATH}/oasis-api-service.yaml`, verbose)
  grabFile(config.oasis.apiLoadbalancer, `${SETUP_PATH}/oasis-api-loadbalancer.yaml`, verbose)
  grabFile(config.oasis.guiDeployment, `${SETUP_PATH}/oasis-gui-deployment.yaml`, verbose)
  grabFile(config.oasis.guiService, `${SETUP_PATH}/oasis-gui-service.yaml`, verbose)
  grabFile(config.oasis.guiLoadbalancer, `${SETUP_PATH}/oasis-gui-loadbalancer.yaml`, verbose)

  if (imageVersion !== 'latest') {
    const options = {
      files: [
        `./${SETUP_PATH}/channels-api-deployment.yaml`,
        `./${SETUP_PATH}/oasis-api-deployment.yaml`,
        `${SETUP_PATH}/oasis-gui-deployment.yaml`,
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
    deployYaml: `./${SETUP_PATH}/oasis-api-deployment.yaml`,
    serviceYaml: `./${SETUP_PATH}/oasis-api-service.yaml`,
    loadbalancerYaml: `./${SETUP_PATH}/oasis-api-loadbalancer.yaml`,
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
    deployYaml: `./${SETUP_PATH}/channels-api-deployment.yaml`,
    serviceYaml: `./${SETUP_PATH}/channels-api-service.yaml`,
    loadbalancerYaml: `./${SETUP_PATH}/channels-api-loadbalancer.yaml`,
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
    deployYaml: `${SETUP_PATH}/oasis-gui-deployment.yaml`,
    serviceYaml: `${SETUP_PATH}/oasis-gui-service.yaml`,
    loadbalancerYaml: `${SETUP_PATH}/oasis-gui-loadbalancer.yaml`,
  }

  const guiDeploy = deployImage(guiImage, gui, verbose)
  if (!guiDeploy) {
    error.logError('Error loading image', 'Unable to deploy Oasis GUI')
    return false
  }

  return true
}
