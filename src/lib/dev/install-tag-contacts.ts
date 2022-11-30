import * as shell from 'shelljs'
import * as error from './errors'
import * as replace from 'replace-in-file'
import {getConfig} from '../../config/dev'
import {deployImage, Yaml} from './deploy'

const config = getConfig()
const SETUP_PATH = 'openline-setup'
// Contacts GUI config
const GUI_DEPLOYMENT = SETUP_PATH + '/contacts-gui-deployment.yaml'
const GUI_SERVICE = SETUP_PATH + '/contacts-gui-service.yaml'
const GUI_LOADBALANCER = SETUP_PATH + '/contacts-gui-loadbalancer.yaml'

export function installContacts(verbose :boolean, imageVersion = 'latest') :boolean {
  shell.exec(`mkdir ${SETUP_PATH}`)

  const setup = getSetupFiles(verbose, imageVersion)
  if (!setup) return false

  const install = contactsInstall(verbose, imageVersion)
  if (!install) return false

  shell.exec(`rm -r ${SETUP_PATH}`)
  return true
}

function getSetupFiles(verbose :boolean, imageVersion = 'latest') :boolean {
  if (imageVersion !== 'latest') {
    const options = {
      files: [
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

function contactsInstall(verbose :boolean, imageVersion = 'latest') :boolean {
  // deploy Contacts GUI container image
  // eslint-disable-next-line unicorn/prefer-spread
  const guiImage = (config.contacts.guiImage.concat(imageVersion))
  const gui: Yaml = {
    deployYaml: `./${GUI_DEPLOYMENT}`,
    serviceYaml: `./${GUI_SERVICE}`,
    loadbalancerYaml: `./${GUI_LOADBALANCER}`,
  }
  const guiDeploy = deployImage(guiImage, gui, verbose)
  if (!guiDeploy) {
    error.logError('Error loading image', 'Unable to deploy Contacts GUI')
    return false
  }

  return true
}
