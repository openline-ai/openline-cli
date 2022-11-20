import * as shell from 'shelljs'
import * as config from 'config'

export function xcodeCheck() :boolean {
    let result = shell.exec('which xcode-select', {silent: true})
    if (result.code == 0) {
        return true
    }
    else {
        return false
    }
}

export function installXcode() :boolean {
    let install: string = config.get('dependencies.xcode.mac')
    let result = shell.exec(install)
    if (result.code == 0) {
        return true
    } else {
        return false
    }
}