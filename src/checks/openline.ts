import * as shell from 'shelljs'

export function runningCheck(verbose: boolean) :boolean {
    if (shell.exec('colima status', {silent: !verbose}).code == 0) {
      return true
    }
    else {
      return false
    }
  }
  
export function installCheck(verbose: boolean) :boolean {
    if (shell.exec('kubectl get ns openline', {silent: !verbose}).code == 0) {
      return true
    }
    else {
      return false
    }
  }