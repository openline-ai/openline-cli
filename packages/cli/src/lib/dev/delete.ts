import * as shell from 'shelljs'
import {logTerminal} from '../logs'
import * as colima from './colima'
import * as k3d from './k3d'
import {getPlatform} from '../dependencies'

export interface Apps {
  deployments: string[],
  services: string[],
  statefulsets: string[],
}

export function deleteApp(apps: Apps, verbose: boolean) :boolean {
  const NAMESPACE = 'openline'

  for (const deployment of apps.deployments) {
    const kubeDeleteDeployment = `kubectl delete deployments ${deployment} -n ${NAMESPACE}`
    if (verbose) logTerminal('EXEC', kubeDeleteDeployment)
    const result = shell.exec(kubeDeleteDeployment, {silent: true})
    if (result.code === 0) {
      logTerminal('SUCCESS', `${deployment} deployment successfully uninstalled`)
    } else {
      logTerminal('ERROR', result.stderr, 'dev:delete:deleteApp')
    }
  }

  for (const statefulset of apps.statefulsets) {
    const kubeDeleteStatefulset = `kubectl delete statefulset ${statefulset} -n ${NAMESPACE}`
    if (verbose) logTerminal('EXEC', kubeDeleteStatefulset)
    const result = shell.exec(kubeDeleteStatefulset, {silent: true})
    if (result.code === 0) {
      logTerminal('SUCCESS', `${statefulset} successfully uninstalled`)
    } else {
      logTerminal('ERROR', result.stderr, 'dev:delete:deleteApp')
    }
  }

  for (const service of apps.services) {
    const kubeDeleteService = `kubectl delete service ${service} -n ${NAMESPACE}`
    if (verbose) logTerminal('EXEC', kubeDeleteService)
    const result = shell.exec(kubeDeleteService, {silent: true})
    if (result.code === 0) {
      logTerminal('SUCCESS', `${service} successfully uninstalled`)
    } else {
      logTerminal('ERROR', result.stderr, 'dev:delete:deleteApp')
    }
  }

  return true
}

export function deleteAll(verbose: boolean) :boolean {
  switch (getPlatform()) {
  case 'mac':
    return colima.deleteAll(verbose)
  case 'linux':
    return k3d.deleteAll(verbose)
  }

  return false
}
