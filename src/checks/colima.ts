import * as shell from 'shelljs'

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
    let result = shell.exec('brew install colima')
    if (result.code == 0) {
        return true
    } else {
        return false
    }
}