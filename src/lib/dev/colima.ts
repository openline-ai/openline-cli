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
  if (context.includes('colima')) return true

  if (verbose) logTerminal('INFO', 'setting kubernetes context to colima...')
  const useContext = 'kubectl config use-context colima'
  if (verbose) logTerminal('EXEC', useContext)
  const update = shell.exec(useContext, {silent: true})
  if (update.code !== 0) {
    // this creates the colima context in ~./kube/config if it doesn't exist
    if (verbose) logTerminal('INFO', 'creating kubernetes context for colima')
    const createContext = 'colima kubernetes reset'
    if (verbose) logTerminal('EXEC', createContext)
    if (shell.exec(createContext, {silent: !verbose}).code === 0) {
      if (verbose) logTerminal('EXEC', useContext)
      return shell.exec(useContext, {silent: true}).code === 0
    }
  }

  return true
}

export function startColima(verbose :boolean) :boolean {
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
  const CPU = config.server.cpu
  const MEMORY = config.server.memory
  const DISK = config.server.disk
  const colimaStart = `colima start --with-kubernetes --cpu ${CPU} --memory ${MEMORY} --disk ${DISK}`
  if (verbose) logTerminal('EXEC', colimaStart)
  const start = shell.exec(colimaStart, {silent: true})
  if (start.code !== 0) {
    logTerminal('ERROR', start.stderr, 'dev:colima:startColima')
    exit(1)
  }

  return contextCheck(verbose)
}
