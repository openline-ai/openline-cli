import * as shell from 'shelljs'

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
    let result = shell.exec('xcode-select --install')
    if (result.code == 0) {
        return true
    } else {
        return false
    }
}