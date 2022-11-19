import * as shell from 'shelljs'

export function dockerCheck() :boolean {
    let result = shell.exec('which docker', {silent: true})
    if (result.code == 0) {
        return true
    }
    else {
        return false
    }
}

export function installDocker() :boolean {
    let result = shell.exec('brew install docker')
    if (result.code == 0) {
        return true
    } else {
        return false
    }
}