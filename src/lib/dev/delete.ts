import * as shell from 'shelljs'
import {logTerminal} from '../logs'

export function deleteApp(deployments: string[], services: string[], verbose: boolean) :boolean {
  const NAMESPACE = 'openline'

  for (const deployment of deployments) {
    const kubeDeleteDeployment = `kubectl delete deployments ${deployment} -n ${NAMESPACE}`
    if (verbose) logTerminal('EXEC', kubeDeleteDeployment)
    const result = shell.exec(kubeDeleteDeployment, {silent: true})
    if (result.code === 0) {
      logTerminal('SUCCESS', `${deployment} deployment successfully uninstalled`)
    } else {
      logTerminal('ERROR', result.stderr, 'dev:delete:deleteApp')
    }
  }

  for (const service of services) {
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
  const cmd = 'colima kubernetes reset'
  if (verbose) logTerminal('EXEC', cmd)
  const reset = shell.exec(cmd, {silent: true})
  if (reset.code === 0) {
    logTerminal('SUCCESS', 'Openline dev server has been deleted', 'to stop the dev server, run => openline dev stop')
  } else {
    logTerminal('ERROR', reset.stderr, 'dev:delete:deleteAll')
    return false
  }

  return true
}
