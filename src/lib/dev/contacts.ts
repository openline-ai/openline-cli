import * as shell from 'shelljs'
import * as error from './errors'
import {getConfig} from '../../config/dev'
import {deployImage, Yaml, updateImageTag} from './deploy'
import {buildLocalImage} from './build-image'

const config = getConfig()
const NAMESPACE = config.namespace.name
const CONTACTS_GUI = 'contacts-gui-service'

function contactsGuiCheck() :boolean {
  return (shell.exec(`kubectl get service ${CONTACTS_GUI} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

export function installContactsGui(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  if (contactsGuiCheck()) return true
  const CONTACTS_IMAGE = 'openline-contacts'
  const DEPLOYMENT = location + config.contacts.guiDeployment
  const SERVICE = location + config.contacts.guiService
  const LOADBALANCER = location + config.contacts.guiLoadbalancer

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion, verbose)
    if (!tag) return false
  }

  let image: string | null = config.contacts.guiImage + imageVersion

  if (location !== config.setupDir) {
    const buildPath = location + '/packages/apps/contacts'
    buildLocalImage(buildPath, CONTACTS_IMAGE, verbose)
    image = null
  }

  const installConfig: Yaml = {
    deployYaml: DEPLOYMENT,
    serviceYaml: SERVICE,
    loadbalancerYaml: LOADBALANCER,
  }
  const deploy = deployImage(image, installConfig, verbose)
  if (deploy === false) {
    error.logError('Error loading image', 'Unable to deploy Contacts GUI', true)
    return false
  }

  return true
}

export function pingContactsGui() :boolean {
  return shell.exec('curl localhost:3000', {silent: true}).code === 0
}
