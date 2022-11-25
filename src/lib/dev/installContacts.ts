import * as shell from 'shelljs'
import * as error from './errors'
import {getConfig} from '../../config/dev'
import * as replace from 'replace-in-file'
import { deployImage } from './deploy'
import { grabFile } from './setupFiles'

export function installContacts(verbose :boolean, imageVersion: string = 'latest') :boolean {

    return false
}

function getSetupFiles(verbose :boolean, imageVersion: string = 'latest') :boolean {
    let result = true
    let config = getConfig()

    let dir = shell.exec('mkdir openline-setup')

    let f1 = grabFile(config.contacts.guiDeployment, 'openline-setup/contacts-gui-deployment.yaml', verbose)
    let f2 = grabFile(config.contacts.guiService, 'openline-setup/contacts-gui-service.yaml', verbose)

    if (imageVersion != 'latest') {
        const options = {
            files: [
                './openline-setup/contacts-gui-deployment.yaml'
            ],
            from: 'latest',
            to: imageVersion
        }
        try {
            const textReplace = replace.sync(options);
            if (verbose) {console.log('Replacement results:', textReplace)}
          }
          catch (error: any) {
            error.logError(error, 'Unable to modify config files to use specified image version')
          }
    }

    return result
}

function contactsInstall(verbose :boolean, imageVersion :string = 'latest') :boolean {
    let result = true
    let config = getConfig()

    // deploy Contacts GUI container image
    let guiImage = config.contacts.guiImage.concat(imageVersion)
    let guiDeployFile = './openline-setup/contacts-gui-deployment.yaml'
    let guiServiceFile = './openline-setup/contacts-gui-service.yaml'
    let guiDeploy = deployImage(guiImage, guiDeployFile, guiServiceFile, verbose)
    if (!guiDeploy) {
        error.logError('Error loading image', 'Unable to deploy Contacts GUI')
        return false
    }

    return result
}
