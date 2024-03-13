import * as shell from 'shelljs'
import * as replace from 'replace-in-file'
import { getConfig } from '../../config/dev'
import { logTerminal } from '../logs'
import { getPlatform } from '../dependencies'
import * as fs from 'node:fs'
import * as YAML from 'yaml'
import * as k3d from './k3d'

const config = getConfig()
const NAMESPACE = config.namespace.name

export interface Yaml {
  deployYaml: string,
  serviceYaml?: string,
  loadbalancerYaml?: string
}

export function deployImage(imageUrl: string | null, deployConfig: Yaml, verbose = false): boolean {
  if (verbose) {
    logTerminal('INFO', 'deploying image', imageUrl?.toString())
  }

  if (imageUrl !== null) {
    const dockerPull = `docker pull ${imageUrl}`
    if (verbose) logTerminal('EXEC', dockerPull)
    const pull = shell.exec(dockerPull, { silent: true })
    if (pull.code !== 0) {
      logTerminal('ERROR', pull.stderr, 'dev:deploy:deployImage')
      return false
    }

    if (getPlatform() === 'linux') {
      const pushCmd = 'k3d image import ' + imageUrl + ' -c development'
      if (verbose) logTerminal('EXEC', pushCmd)
      const push = shell.exec(pushCmd, { silent: !verbose })
      if (push.code !== 0) {
        logTerminal('ERROR', push.stderr, 'dev:deploy:tagImage')
        return false
      }
    }
  }

  let ok = deployDeployment(deployConfig.deployYaml, verbose)
  if (!ok) {
    return false
  }

  if(deployConfig && deployConfig.serviceYaml !== null) {
    const kubeApplyServiceConfig = `kubectl apply -f ${deployConfig.serviceYaml} --namespace ${NAMESPACE}`
    if (verbose) logTerminal('EXEC', kubeApplyServiceConfig)
    const service = shell.exec(kubeApplyServiceConfig, { silent: !verbose })
    if (service.code !== 0) {
      logTerminal('ERROR', service.stderr, 'dev:deploy:deployImage')
      return false
    }
  }

  if ('loadbalancerYaml' in deployConfig && deployConfig.loadbalancerYaml !== null) {
    const lb = deployLoadbalancer(deployConfig.loadbalancerYaml ? deployConfig.loadbalancerYaml : '', verbose)
    if (!lb) {
      return false
    }
  }

  return true
}

export function updateImageTag(deployFiles: string[], imageVersion: string): boolean {
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

export function deployLoadbalancer(YamlConfigPath: string, verbose: boolean): boolean {
  const kubeApplyLoadbalancer = `kubectl apply -f ${YamlConfigPath} --namespace ${NAMESPACE}`
  if (verbose) logTerminal('EXEC', kubeApplyLoadbalancer)
  const lb = shell.exec(kubeApplyLoadbalancer, { silent: !verbose })
  if (lb.code !== 0) {
    logTerminal('ERROR', lb.stderr, 'dev:deploy:deployLoadbalancer')
    return false
  }

  if (getPlatform() === 'linux') {
    const yamlConfigPath = YamlConfigPath;
    const file = fs.readFileSync(yamlConfigPath ? yamlConfigPath : '', 'utf8')
    const config = YAML.parse(file)
    for (const val of config.spec.ports) {
      if (!k3d.createPortForward(verbose, val.port, val.protocol)) {
        return false
      }
    }
  }

  return true
}

export function deployDeployment(YamlConfigPath: string, verbose: boolean): boolean {
  const kubeApplyDeployment = `kubectl apply -f ${YamlConfigPath} --namespace ${NAMESPACE}`
  if (verbose) logTerminal('EXEC', kubeApplyDeployment)
  const deploy = shell.exec(kubeApplyDeployment, { silent: !verbose })
  if (deploy.code !== 0) {
    logTerminal('ERROR', deploy.stderr, 'dev:deploy:deployDeployment')
    return false
  }
  return true
}
