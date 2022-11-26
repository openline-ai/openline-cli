import * as shell from 'shelljs'

export function runningCheck() :boolean {
  return (shell.exec('colima status', {silent: true}).code === 0)
}

export function installCheck() :boolean {
  return (shell.exec('kubectl get ns openline', {silent: true}).code === 0)
}
