import * as shell from 'shelljs'
import * as error from '../../errors'
import * as checks from '../checks/openline'
import {getConfig} from '../../config/dev'

export function startColima(verbose :boolean) :boolean {
    let config = getConfig()
    let result = false
    let isRunning = checks.runningCheck(verbose)
  
    if (!isRunning) {
      let cpu: string = config.server.cpu
      let memory: string = config.server.memory
      let disk: string = config.server.disk
      let start = shell.exec(`colima start --with-kubernetes --cpu ${cpu} --memory ${memory} --disk ${disk}`, {silent: !verbose})
      if (start.code != 0) {
        error.logError(start.stderr, 'Try reinstalling Colima', 'https://github.com/abiosoft/colima')
      }
      else {
        result = true
      }
    }
    else {
      result = true
    }
    return result
  } 

  