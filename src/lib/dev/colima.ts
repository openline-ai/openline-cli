import * as shell from 'shelljs'
import * as error from './errors'
import {getConfig} from '../../config/dev'
import {logTerminal} from '../logs'

export function runningCheck() :boolean {
  return (shell.exec('colima status', {silent: true}).code === 0)
}

export function contextCheck(verbose: boolean): boolean {
  const context = shell.exec('kubectl config get-contexts | grep "*"', {silent: true}).stdout
  if (context.includes('colima')) return true

  const useContext = 'kubectl config use-context colima'
  if (verbose) logTerminal('EXEC', useContext)
  const update = shell.exec(useContext, {silent: true})
  if (update.code !== 0) {
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
  const isRunning = runningCheck()
  if (isRunning) {
    const isContext = contextCheck(verbose)
    if (isContext) return true
  }

  const CPU = config.server.cpu
  const MEMORY = config.server.memory
  const DISK = config.server.disk
  const colimaStart = `colima start --with-kubernetes --cpu ${CPU} --memory ${MEMORY} --disk ${DISK}`
  if (verbose) console.log(`[EXEC] ${colimaStart}`)
  const start = shell.exec(colimaStart, {silent: !verbose})
  if (start.code !== 0) {
    error.logError(start.stderr, 'Could not start colima')
    return false
  }

  return contextCheck(verbose)
}
