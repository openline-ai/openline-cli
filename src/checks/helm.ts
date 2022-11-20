import * as shell from 'shelljs'
import * as config from 'config'

export function helmCheck() :boolean {
    let result = shell.exec('which helm', {silent: true})
    if (result.code == 0) {
        return true
    }
    else {
        return false
    }
}

export function installHelm() :boolean {
    let install: string = config.get('dependencies.helm.mac')
    let result = shell.exec(install)
    if (result.code == 0) {
        return true
    } else {
        return false
    }
}