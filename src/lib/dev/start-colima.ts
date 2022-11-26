import * as shell from 'shelljs'
import * as error from './errors'
import * as checks from './dev-server-checks'
import {getConfig} from '../../config/dev'

export function startColima(verbose :boolean) :boolean {
  const config = getConfig()
  const isRunning = checks.runningCheck()
  if (isRunning) {
    return true
  }

  const CPU = config.server.cpu
  const MEMORY = config.server.memory
  const DISK = config.server.disk
  const start = shell.exec(`colima start --with-kubernetes --cpu ${CPU} --memory ${MEMORY} --disk ${DISK}`, {silent: !verbose})
  if (start.code !== 0) {
    error.logError(start.stderr, 'Could not start colima')
    return false
  }

  return true
}
