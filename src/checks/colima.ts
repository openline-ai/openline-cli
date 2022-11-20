import * as shell from 'shelljs'
import * as config from 'config'
import { dependencies } from './mac'

export function colimaCheck() :boolean {
    let result = shell.exec('which colima', {silent: true})
    if (result.code == 0) {
        return true
    }
    else {
        return false
    }
}

export function installColima() :boolean {
    let install: string = config.get('dependencies.colima.mac')
    let result = shell.exec(install)
    if (result.code == 0) {
        return true
    } else {
        return false
    }
}