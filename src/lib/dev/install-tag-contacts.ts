import * as shell from 'shelljs'
import * as error from './errors'
import * as replace from 'replace-in-file'
import {getConfig} from '../../config/dev'
import {deployImage, grabFile} from './deploy'

const config = getConfig()

export function installContacts(verbose :boolean, imageVersion = 'latest') :boolean {
  return false
}

function getSetupFiles(verbose :boolean, imageVersion = 'latest') :boolean {
  const dir = shell.exec('mkdir openline-setup')
  if (dir.code !== 0) {
    error.logError(dir.stderr, 'Could not make setup directory')
    return false
  }

  grabFile(config.contacts.guiDeployment, 'openline-setup/contacts-gui-deployment.yaml', verbose)
  grabFile(config.contacts.guiService, 'openline-setup/contacts-gui-service.yaml', verbose)

  if (imageVersion !== 'latest') {
    const options = {
      files: [
        './openline-setup/contacts-gui-deployment.yaml',
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
  const guiImage = (config.contacts.guiImage.concat(imageVersion))
  const gui = {
    deployYaml: './openline-setup/contacts-gui-deployment.yaml',
    serviceYaml: './openline-setup/contacts-gui-service.yaml',
  }
  const guiDeploy = deployImage(guiImage, gui, verbose)
  if (!guiDeploy) {
    error.logError('Error loading image', 'Unable to deploy Contacts GUI')
    return false
  }

  return true
}
