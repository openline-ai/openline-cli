import * as shell from 'shelljs'
import * as error from './errors'
import {getConfig} from '../../config/dev'

export function runningCheck() :boolean {
  return (shell.exec('colima status', {silent: true}).code === 0)
}

export function startColima(verbose :boolean) :boolean {
  const config = getConfig()
  const isRunning = runningCheck()
  if (isRunning) {
    return true
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

  return true
}
