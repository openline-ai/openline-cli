import * as shell from 'shelljs'
import * as error from './errors'
import * as replace from 'replace-in-file'
import {getConfig} from '../../config/dev'

const config = getConfig()
const NAMESPACE = config.namespace.name

export interface Yaml {
    deployYaml: string,
    serviceYaml: string,
    loadbalancerYaml?: string
}

export function deployImage(imageUrl :string | null, deployConfig :Yaml, verbose = false) :boolean {
  if (verbose) {
    console.log('Deploying image', imageUrl)
    console.log(deployConfig)
  }

  if (imageUrl !== null) {
    const dockerPull = `docker pull ${imageUrl}`
    if (verbose) console.log(`[EXEC] ${dockerPull}`)
    const pull = shell.exec(dockerPull, {silent: !verbose})
    if (pull.code !== 0) {
      error.logError(pull.stderr, `Unable to pull image ${imageUrl}`)
      return false
    }
  }

  const kubeApplyDeployConfig = `kubectl apply -f ${deployConfig.deployYaml} --namespace ${NAMESPACE}`
  if (verbose) console.log(`[EXEC] ${kubeApplyDeployConfig}`)
  const deploy = shell.exec(kubeApplyDeployConfig, {silent: !verbose})
  if (deploy.code !== 0) {
    return false
  }

  const kubeApplyServiceConfig = `kubectl apply -f ${deployConfig.serviceYaml} --namespace ${NAMESPACE}`
  if (verbose) console.log(`[EXEC] ${kubeApplyServiceConfig}`)
  const service = shell.exec(kubeApplyServiceConfig, {silent: !verbose})
  if (service.code !== 0) {
    return false
  }

  if (deployConfig.loadbalancerYaml !== null) {
    const kubeApplyLoadbalancer = `kubectl apply -f ${deployConfig.loadbalancerYaml} --namespace ${NAMESPACE}`
    if (verbose) console.log(`[EXEC] ${kubeApplyLoadbalancer}`)
    const lb = shell.exec(kubeApplyLoadbalancer, {silent: !verbose})
    if (lb.code !== 0) {
      return false
    }
  }

  return true
}

export function updateImageTag(deployFiles: string[], imageVersion: string, verbose: boolean) :boolean {
  const options = {
    files: deployFiles,
    from: 'latest',
    to: imageVersion,
  }
  try {
    const textReplace = replace.sync(options)
    if (verbose) {
      console.log('Replacement results:', textReplace)
    }
  } catch (error: any) {
    error.logError(error, 'Unable to modify config files to use specified image version', true)
    return false
  }

  return true
}

export function deployLoadbalancer(YamlConfigPath: string, verbose: boolean) :boolean {
  const kubeApplyLoadbalancer = `kubectl apply -f ${YamlConfigPath} --namespace ${NAMESPACE}`
  if (verbose) console.log(`[EXEC] ${kubeApplyLoadbalancer}`)
  const lb = shell.exec(kubeApplyLoadbalancer, {silent: !verbose})
  if (lb.code !== 0) return false
  return true
}
