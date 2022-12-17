import * as shell from 'shelljs'
import {getConfig} from '../../config/dev'
import {deployImage, Yaml, updateImageTag} from './deploy'
import {buildLocalImage} from './build-image'
import {logTerminal} from '../logs'

const config = getConfig()
const NAMESPACE = config.namespace.name
const CONTACTS_GUI = 'contacts-gui-service'

function contactsGuiCheck() :boolean {
  return (shell.exec(`kubectl get service ${CONTACTS_GUI} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

export function installContactsGui(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  if (contactsGuiCheck()) return true
  const CONTACTS_IMAGE = 'contacts-gui'
  const DEPLOYMENT = location + config.contacts.guiDeployment
  const SERVICE = location + config.contacts.guiService
  const LOADBALANCER = location + config.contacts.guiLoadbalancer

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion)
    if (!tag) return false
  }

  let image: string | null = config.contacts.guiImage + imageVersion

  if (location !== config.setupDir) {
    // come back to this when Dockerfiles are standardized
    const buildPath = location + '/packages/apps/contacts'
    buildLocalImage(buildPath, buildPath, CONTACTS_IMAGE, verbose)
    image = null
  }

  const installConfig: Yaml = {
    deployYaml: DEPLOYMENT,
    serviceYaml: SERVICE,
    loadbalancerYaml: LOADBALANCER,
  }
  const deploy = deployImage(image, installConfig, verbose)
  if (deploy === false) return false

  logTerminal('SUCCESS', 'contacts-gui successfully installed')
  return true
}

export function pingContactsGui() :boolean {
  return shell.exec('curl localhost:3001', {silent: true}).code === 0
}
