import {exit} from 'node:process'
import * as shell from 'shelljs'
import {getConfig} from '../../config/dev'
import {logTerminal} from '../logs'

export function runningCheck() :boolean {
  return (shell.exec('colima status', {silent: true}).code === 0)
}

export function contextCheck(verbose: boolean): boolean {
  if (verbose) logTerminal('INFO', 'checking kubernetes contexts...')
  const check = 'kubectl config get-contexts | grep "*"'
  if (verbose) logTerminal('EXEC', check)
  const context = shell.exec(check, {silent: true}).stdout
  if (context.includes('k3d')) return true

  if (verbose) logTerminal('INFO', 'setting kubernetes context to k3d-development...')
  const useContext = 'kubectl config use-context k3d-development'
  if (verbose) logTerminal('EXEC', useContext)
  const update = shell.exec(useContext, {silent: true})
  if (update.code !== 0) {
    // this creates the colima context in ~./kube/config if it doesn't exist
    if (verbose) logTerminal('INFO', 'creating kubernetes context for k3d-developmet')
    const createContext = 'k3d kubeconfig merge mycluster --kubeconfig-switch-context'
    if (verbose) logTerminal('EXEC', createContext)
    if (shell.exec(createContext, {silent: !verbose}).code === 0) {
      if (verbose) logTerminal('EXEC', useContext)
      return shell.exec(useContext, {silent: true}).code === 0
    }
  }

  return true
}

export function startk3d(verbose :boolean) :boolean {
  const config = getConfig()

  // check to see if Colima is already running
  const isRunning = runningCheck()
  if (isRunning) {
    // if running, checks to make sure context hasn't changed (still colima)
    const isContext = contextCheck(verbose)
    if (isContext) return true
  }

  // start up Colima with Openline configurations
  contextCheck(false)

  const check = 'k3d cluster list'
  let start: shell.ShellReturnValue
  if (verbose) logTerminal('EXEC', check)
  const context = shell.exec(check, {silent: true}).stdout
  if (context.includes('development')) {
    const k3dStart = `k3d cluster start development`
    if (verbose) logTerminal('EXEC', k3dStart)
    start = shell.exec(k3dStart, {silent: true})
  } else {
    const k3dStart = `k3d cluster create development`
    if (verbose) logTerminal('EXEC', k3dStart)
    start = shell.exec(k3dStart, {silent: true})
  }
  if (start.code !== 0) {
    logTerminal('ERROR', start.stderr, 'dev:k3d:startK3d')
    exit(1)
  }

  return contextCheck(verbose)
}

export function deleteAll(verbose: boolean) :boolean {
  const cmd = 'k3d cluster delete development'
  if (verbose) logTerminal('EXEC', cmd)
  const reset = shell.exec(cmd, {silent: true})
  if (reset.code === 0) {
    logTerminal('SUCCESS', 'Openline dev server has been deleted')
    logTerminal('INFO', 'to stop the dev server, run => openline dev stop')
  } else {
    logTerminal('ERROR', reset.stderr, 'dev:delete:deleteAll')
    return false
  }

  return true
}

export function stopK3d(verbose: boolean) {
  logTerminal('INFO', '🦦 Saving current configuration...')
  if (verbose)
    logTerminal('EXEC', 'k3d custer stop')
  const reset = shell.exec('k3d custer stop', { silent: true })
  if (reset.code === 0) {
    logTerminal('SUCCESS', 'Openline dev server stopped')
  } else {
    logTerminal('ERROR', reset.stderr, 'dev:stop')
  }
}