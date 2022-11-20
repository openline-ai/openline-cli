import * as shell from 'shelljs'
import * as config from 'config'

export function kubeCheck() :boolean {
    let result = shell.exec('which kubectl', {silent: true})
    if (result.code == 0) {
        return true
    }
    else {
        return false
    }
}

export function installKube() :boolean {
    let install: string = config.get('dependencies.kubectl.mac')
    let result = shell.exec(install)
    if (result.code == 0) {
        return true
    } else {
        return false
    }
}