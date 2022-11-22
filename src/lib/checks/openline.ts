import * as shell from 'shelljs'

export function runningCheck() :boolean {
    if (shell.exec('colima status', {silent: true}).code == 0) {
      return true
    }
    else {
      return false
    }
  }
  
export function installCheck() :boolean {
    if (shell.exec('kubectl get ns openline', {silent: true}).code == 0) {
      return true
    }
    else {
      return false
    }
  }