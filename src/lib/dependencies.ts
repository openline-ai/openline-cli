import {exit} from 'node:process'
import * as shell from 'shelljs'
import {getConfig} from '../config/dev'
import {logTerminal} from './logs'
const config = getConfig()

// colima
export function colimaCheck() :boolean {
  return (shell.exec('which colima', {silent: true}).code === 0)
}

export function installColima() :boolean {
  logTerminal('INFO', 'We need to install colima before continuing')
  const result = shell.exec(config.dependencies.colimaMac).code === 0
  if (result) {
    logTerminal('SUCCESS', 'colima successfully installed')
  } else {
    logTerminal('ERROR', 'colima installation failed', 'Please install colima before retrying the command.')
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
  const result = shell.exec(config.dependencies.dockerMac).code === 0
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
  const results = shell.exec(config.dependencies.gitMac).code === 0
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
  const results = shell.exec(config.dependencies.helmMac).code === 0
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
  const results = shell.exec(config.dependencies.homebrew).code === 0
  if (results) {
    logTerminal('SUCCESS', 'homebrew successfully installed  Please follow the homebrew instructions above, and once complete, restart the command.')
    exit(0)
  } else {
    logTerminal('ERROR', 'homebrew installation failed', 'Please install homebrew before retrying the command.')
    exit(1)
  }
}

// kubectl
export function kubeCheck() :boolean {
  return (shell.exec('which kubectl', {silent: true}).code === 0)
}

export function installKube() :boolean {
  logTerminal('INFO', 'We need to install kubectl before continuing')
  const results = shell.exec(config.dependencies.kubectlMac).code === 0
  if (results) {
    logTerminal('SUCCESS', 'kubectl successfully installed')
  } else {
    logTerminal('ERROR', 'kubectl installation failed', 'Please install kubectl before retrying the command.')
    exit(1)
  }

  exit(0)
}

// xcode
export function xcodeCheck() :boolean {
  return (shell.exec('which xcode-select', {silent: true}).code === 0)
}

export function installXcode() :boolean {
  logTerminal('INFO', 'We need to install xcode before continuing')
  const results = shell.exec(config.dependencies.xcode).code === 0
  if (results) {
    logTerminal('SUCCESS', 'xcode successfully installed')
  } else {
    logTerminal('ERROR', 'xcode installation failed', 'Please install xcode before retrying the command.')
    exit(1)
  }

  exit(0)
}
