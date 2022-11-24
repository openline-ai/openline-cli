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

    let f1 = grabFile(config.contacts.apiDeployment, 'openline-setup/contacts-api-deployment.yaml', verbose)
    let f2 = grabFile(config.contacts.apiService, 'openline-setup/contacts-api-service.yaml', verbose)
    let f3 = grabFile(config.contacts.apiLoadbalancer, 'openline-setup/contacts-api-loadbalancer.yaml', verbose)
    let f4 = grabFile(config.contacts.guiDeployment, 'openline-setup/contacts-gui-deployment.yaml', verbose)
    let f5 = grabFile(config.contacts.guiService, 'openline-setup/contacts-gui-service.yaml', verbose)
    let f6 = grabFile(config.contacts.guiLoadbalancer, 'openline-setup/contacts-gui-loadbalancer.yaml', verbose)

    if (imageVersion != 'latest') {
        const options = {
            files: [
                './openline-setup/contacts-api-deployment.yaml',
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

    // deploy Contacts API container image
    let apiImage = config.contacts.apiImage.concat(imageVersion)
    let apiDeployFile = './openline-setup/contacts-api-deployment.yaml'
    let apiServiceFile = './openline-setup/contacts-api-service.yaml'
    let apiLbFile = './openline-setup/contacts-api-loadbalancer.yaml'
    let apiDeploy = deployImage(apiImage, apiDeployFile, apiServiceFile, apiLbFile, verbose)
    if (!apiDeploy) {
        error.logError('Error loading image', 'Unable to deploy Contacts API')
        return false
    }

    // deploy Contacts GUI container image
    let guiImage = config.contacts.guiImage.concat(imageVersion)
    let guiDeployFile = ''
    let guiServiceFile = ''
    let guiLbFile = ''
    let guiDeploy = deployImage(guiImage, guiDeployFile, guiServiceFile, guiLbFile, verbose)
    if (!guiDeploy) {
        error.logError('Error loading image', 'Unable to deploy Contacts GUI')
        return false
    }

    return result
}