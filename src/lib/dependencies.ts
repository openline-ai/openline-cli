import * as shell from 'shelljs'
import {getConfig} from '../config/dev'
const config = getConfig()

// colima
export function colimaCheck() :boolean {
  return (shell.exec('which colima', {silent: true}).code === 0)
}

export function installColima() :boolean {
  return (shell.exec(config.dependencies.colimaMac).code === 0)
}

// docker
export function dockerCheck() :boolean {
  return (shell.exec('which docker', {silent: true}).code === 0)
}

export function installDocker() :boolean {
  return (shell.exec(config.dependencies.dockerMac).code === 0)
}

// git
export function gitCheck() :boolean {
  return (shell.exec('which git', {silent: true}).code === 0)
}

export function installGit() :boolean {
  return (shell.exec(config.dependencies.gitMac).code === 0)
}

// helm
export function helmCheck() :boolean {
  return (shell.exec('which helm', {silent: true}).code === 0)
}

export function installHelm() :boolean {
  return (shell.exec(config.dependencies.helmMac).code === 0)
}

// homebrew
export function brewCheck() :boolean {
  return (shell.exec('which brew', {silent: true}).code === 0)
}

export function installBrew() :boolean {
  return (shell.exec(config.dependencies.homebrew).code === 0)
}

// kubectl
export function kubeCheck() :boolean {
  return (shell.exec('which kubectl', {silent: true}).code === 0)
}

export function installKube() :boolean {
  return (shell.exec(config.dependencies.kubectlMac).code === 0)
}

// xcode
export function xcodeCheck() :boolean {
  return (shell.exec('which xcode-select', {silent: true}).code === 0)
}

export function installXcode() :boolean {
  return (shell.exec(config.dependencies.xcode).code === 0)
}
