import * as shell from 'shelljs'
import * as replace from 'replace-in-file'
import {getConfig} from '../../config/dev'
import {logTerminal} from '../logs'
import { getPlatform } from '../dependencies'
import * as k3d from './k3d'


const config = getConfig()
const NAMESPACE = config.namespace.name

export interface Yaml {
    deployYaml: string,
    serviceYaml: string,
    loadbalancerYaml?: string
}

export function deployImage(imageUrl :string | null, deployConfig :Yaml, verbose = false) :boolean {
  if (verbose) {
    logTerminal('INFO', 'deploying image', imageUrl?.toString())
  }

  if (imageUrl !== null) {
    const dockerPull = `docker pull ${imageUrl}`
    if (verbose) logTerminal('EXEC', dockerPull)
    const pull = shell.exec(dockerPull, {silent: true})
    if (pull.code !== 0) {
      logTerminal('ERROR', pull.stderr, 'dev:deploy:deployImage')
      return false
    }
  }

  if (getPlatform() == "linux") {
    const port = k3d.getRegistryPort(false)
    const newRepo = 'development-registry.localhost:' + port
    const tagCmd = 'docker tag ' + imageUrl + ' ' + imageUrl?.replace("ghcr.io", newRepo)
    if (verbose) logTerminal('EXEC', tagCmd)
    const tag = shell.exec(tagCmd, {silent: !verbose})
    if (tag.code !== 0) {
      logTerminal('ERROR', tag.stderr, 'dev:deploy:tagImage')
      return false
    }

    const pushCmd = 'docker push ' + imageUrl?.replace("ghcr.io", newRepo)
    if (verbose) logTerminal('EXEC', pushCmd)
    const push = shell.exec(pushCmd, {silent: !verbose})
    if (push.code !== 0) {
      logTerminal('ERROR', push.stderr, 'dev:deploy:tagImage')
      return false
    }
  }

  const kubeApplyDeployConfig = `kubectl apply -f ${deployConfig.deployYaml} --namespace ${NAMESPACE}`
  if (verbose) logTerminal('EXEC', kubeApplyDeployConfig)
  const deploy = shell.exec(kubeApplyDeployConfig, {silent: !verbose})
  if (deploy.code !== 0) {
    logTerminal('ERROR', deploy.stderr, 'dev:deploy:deployImage')
    return false
  }

  const kubeApplyServiceConfig = `kubectl apply -f ${deployConfig.serviceYaml} --namespace ${NAMESPACE}`
  if (verbose) logTerminal('EXEC', kubeApplyServiceConfig)
  const service = shell.exec(kubeApplyServiceConfig, {silent: !verbose})
  if (service.code !== 0) {
    logTerminal('ERROR', service.stderr, 'dev:deploy:deployImage')
    return false
  }

  if (deployConfig.loadbalancerYaml !== null) {
    const kubeApplyLoadbalancer = `kubectl apply -f ${deployConfig.loadbalancerYaml} --namespace ${NAMESPACE}`
    if (verbose) logTerminal('EXEC', kubeApplyLoadbalancer)
    const lb = shell.exec(kubeApplyLoadbalancer, {silent: !verbose})
    if (lb.code !== 0) {
      logTerminal('ERROR', lb.stderr, 'dev:deploy:deployImage')
      return false
    }
  }

  return true
}

export function updateImageName(deployFiles: string[]) :boolean {

  if (getPlatform() == "linux") {
    const port = k3d.getRegistryPort(false)
    const newRepo = 'development-registry.localhost:' + port

    const repoOptions = {
      files: deployFiles,
      from: 'ghcr.io',
      to: newRepo,
    }
    try {
      replace.sync(repoOptions)
    } catch (error: any) {
      logTerminal('ERROR', error)
      return false
    }
  }
  return true
}

export function updateImageTag(deployFiles: string[], imageVersion: string) :boolean {
  const options = {
    files: deployFiles,
    from: 'latest',
    to: imageVersion,
  }
  try {
    replace.sync(options)
  } catch (error: any) {
    logTerminal('ERROR', error)
    return false
  }

  return true
}

export function deployLoadbalancer(YamlConfigPath: string, verbose: boolean) :boolean {
  const kubeApplyLoadbalancer = `kubectl apply -f ${YamlConfigPath} --namespace ${NAMESPACE}`
  if (verbose) logTerminal('EXEC', kubeApplyLoadbalancer)
  const lb = shell.exec(kubeApplyLoadbalancer, {silent: !verbose})
  if (lb.code !== 0) {
    logTerminal('ERROR', lb.stderr, 'dev:deploy:deployLoadbalancer')
    return false
  }

  return true
}
