import {exit} from 'node:process'
import * as shell from 'shelljs'
import {getConfig} from '../config/dev'
import {logTerminal} from './logs'
const config = getConfig()

import fs = require('fs')

export function getPlatform() :string {
  switch (process.platform) {
  case 'darwin':
    return 'mac'
  case 'linux':
    return 'linux'
  default:
    logTerminal('ERROR', 'Operating system unsupported at this time')
    return 'unknown'
  }
}

export function setupDirCheck() :boolean {
  return (fs.existsSync(config.setupDir))
}

export function createSetupDir() :boolean {
  logTerminal('INFO', 'Creating Setup Dir')
  const result = shell.exec('mkdir -p ' + config.setupDir).code === 0
  if (result) {
    logTerminal('SUCCESS', 'Setup dir created')
  } else {
    logTerminal('ERROR', 'Failed to create setup dir')
    exit(1)
  }

  return true
}

export function checkDockerGroup() :void {
  const result = shell.exec('groups', {silent: true}).stdout.includes('docker')
  if (result) {
    logTerminal('SUCCESS', 'User in Docker group')
  } else {
    logTerminal('ERROR', 'User Not Yet in Docker Group', 'Please log out and back in then re-run the command')
    exit(1)
  }
}

// colima
export function colimaCheck() :boolean {
  return (shell.exec('which colima', {silent: true}).code === 0)
}

export function installColima() :boolean {
  logTerminal('INFO', 'We need to install colima before continuing')
  const result = shell.exec(config.dependencies[getPlatform()].colima).code === 0
  if (result) {
    logTerminal('SUCCESS', 'colima successfully installed')
  } else {
    logTerminal('ERROR', 'colima installation failed', 'Please install colima before retrying the command.')
    exit(1)
  }

  return true
}

// colima
export function k3dCheck() :boolean {
  return (shell.exec('which k3d', {silent: true}).code === 0)
}

export function installK3d() :boolean {
  logTerminal('INFO', 'We need to install k3d before continuing')
  const result = shell.exec(config.dependencies[getPlatform()].k3d).code === 0
  if (result) {
    logTerminal('SUCCESS', 'k3d successfully installed')
  } else {
    logTerminal('ERROR', 'k3d installation failed', 'Please install k3d before retrying the command.')
    exit(1)
  }

  return true
}

// docker
export function dockerCheck() :boolean {
  return (shell.exec('which docker', {silent: true}).code === 0)
}

export function installDocker() :boolean {
  logTerminal('INFO', 'We need to install docker before continuing')
  const result = shell.exec(config.dependencies[getPlatform()].docker).code === 0
  if (result) {
    logTerminal('SUCCESS', 'docker successfully installed')
  } else {
    logTerminal('ERROR', 'docker installation failed', 'Please install docker before retrying the command.')
    exit(1)
  }

  return true
}

// git
export function gitCheck() :boolean {
  return (shell.exec('which git', {silent: true}).code === 0)
}

export function installGit() :boolean {
  logTerminal('INFO', 'We need to install git before continuing')
  const results = shell.exec(config.dependencies[getPlatform()].git).code === 0
  if (results) {
    logTerminal('SUCCESS', 'git successfully installed')
  } else {
    logTerminal('ERROR', 'git installation failed', 'Please install git before retrying the command.')
    exit(1)
  }

  return true
}

// helm
export function helmCheck() :boolean {
  return (shell.exec('which helm', {silent: true}).code === 0)
}

export function installHelm() :boolean {
  logTerminal('INFO', 'We need to install helm before continuing')
  const results = shell.exec(config.dependencies[getPlatform()].helm).code === 0
  if (results) {
    logTerminal('SUCCESS', 'helm successfully installed')
  } else {
    logTerminal('ERROR', 'helm installation failed', 'Please install helm before retrying the command.')
    exit(1)
  }

  return true
}

// homebrew
export function brewCheck() :boolean {
  return (shell.exec('which brew', {silent: true}).code === 0)
}

export function installBrew() :void {
  logTerminal('INFO', 'We need to install homebrew before continuing.', 'Process will exit after install as you will need to set your path.  Please follow the instructions at the end of the installation.')
  const results = shell.exec(config.dependencies.mac.homebrew).code === 0
  if (results) {
    logTerminal('SUCCESS', 'homebrew successfully installed  Please follow the homebrew instructions above, and once complete, restart the command.')
    exit(0)
  } else {
    logTerminal('ERROR', 'homebrew installation failed', 'Please install homebrew before retrying the command.')
    exit(1)
  }
}

// netcat
export function netcatCheck() :boolean {
  return (shell.exec('which nc', {silent: true}).code === 0)
}

export function installNetcat() :void {
  logTerminal('INFO', 'We need to install netcat before continuing')
  const results = shell.exec(config.dependencies[getPlatform()].netcat).code === 0
  if (results) {
    logTerminal('SUCCESS', 'netcat successfully installed')
  } else {
    logTerminal('ERROR', 'netcat installation failed', 'Please install netcat before retrying the command.')
    exit(1)
  }
}

// kubectl
export function kubeCheck() :boolean {
  return (shell.exec('which kubectl', {silent: true}).code === 0)
}

export function installKube() :void {
  logTerminal('INFO', 'We need to install kubectl before continuing')
  const results = shell.exec(config.dependencies[getPlatform()].kubectl).code === 0
  if (results) {
    logTerminal('SUCCESS', 'kubectl successfully installed')
  } else {
    logTerminal('ERROR', 'kubectl installation failed', 'Please install kubectl before retrying the command.')
    exit(1)
  }
}

// xcode
export function xcodeCheck() :boolean {
  return (shell.exec('which xcode-select', {silent: true}).code === 0)
}
export function installXcode() :void {
  logTerminal('INFO', 'We need to install xcode before continuing')
  const results = shell.exec(config.dependencies.mac.xcode).code === 0
  if (results) {
    logTerminal('SUCCESS', 'xcode successfully installed')
  } else {
    logTerminal('ERROR', 'xcode installation failed', 'Please install xcode before retrying the command.')
    exit(1)
  }
}

//jq
export function jqCheck() :boolean {
  return (shell.exec('which jq', {silent: true}).code === 0)
}

export function installJq() :void {
  logTerminal('INFO', 'We need to install jq before continuing')
  const results = shell.exec(config.dependencies[getPlatform()].jq).code === 0
  if (results) {
    logTerminal('SUCCESS', 'jq successfully installed')
  } else {
    logTerminal('ERROR', 'jq installation failed', 'Please install jq before retrying the command.')
    exit(1)
  }
}
