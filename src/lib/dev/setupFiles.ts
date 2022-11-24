import * as shell from 'shelljs'
import * as error from './errors'

export function grabFile(fileLocation: string, setupPath: string, verbose :boolean) :boolean {
    let result = true

    let file = shell.exec(`curl -sS ${fileLocation} -o ${setupPath}`, {silent: !verbose})
    if (file.code != 0) {
        error.logError(file.stderr, `Could not download setup file from ${fileLocation}`)
        return false
     }

    return result
}