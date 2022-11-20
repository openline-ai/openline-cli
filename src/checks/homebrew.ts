import * as shell from 'shelljs'
import * as config from 'config'

export function brewCheck() :boolean {
    let result = shell.exec('which brew', {silent: true})
    if (result.code == 0) {
        return true
    }
    else {
        return false
    }
}

export function installBrew() :boolean {
    let install: string = config.get('dependencies.homebrew.mac')
    let result = shell.exec(install)
    if (result.code == 0) {
        return true
    } else {
        return false
    }
}