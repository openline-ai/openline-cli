import * as shell from 'shelljs'
import * as error from './errors'
import {getConfig} from '../../config/dev'
import * as replace from 'replace-in-file'
import { deployImage } from './deploy'

export function installContacts(verbose :boolean, imageVersion: string = 'latest') :boolean {

    return false
}

function getSetupFiles(verbose :boolean, imageVersion: string = 'latest') :boolean {
    let result = true
    let config = getConfig()

    let dir = shell.exec('mkdir openline-setup')

    let f1 = shell.exec(`curl -sS ${config.contacts.apiDeployment} -o openline-setup/contacts-api-deployment.yaml`, {silent: !verbose})
    if (f1.code != 0) {
       error.logError(f1.stderr, 'The file location must have moved.  Please update config/dev.ts with new location', 'Report this issue => https://github.com/openline-ai/openline-cli/issues/new/choose')
       return false
    }
    let f2 = shell.exec(`curl -sS ${config.contacts.apiService} -o openline-setup/contacts-api-service.yaml`, {silent: !verbose})
    if (f2.code != 0) {
       error.logError(f2.stderr, 'The file location must have moved.  Please update config/dev.ts with new location', 'Report this issue => https://github.com/openline-ai/openline-cli/issues/new/choose')
       return false
    }
    let f3 = shell.exec(`curl -sS ${config.contacts.apiLoadbalancer} -o openline-setup/contacts-api-loadbalancer.yaml`, {silent: !verbose})
    if (f3.code != 0) {
       error.logError(f3.stderr, 'The file location must have moved.  Please update config/dev.ts with new location', 'Report this issue => https://github.com/openline-ai/openline-cli/issues/new/choose')
       return false
    }
    let f4 = shell.exec(`curl -sS ${config.contacts.guiDeployment} -o openline-setup/contacts-gui-deployment.yaml`, {silent: !verbose})
    if (f4.code != 0) {
       error.logError(f4.stderr, 'The file location must have moved.  Please update config/dev.ts with new location', 'Report this issue => https://github.com/openline-ai/openline-cli/issues/new/choose')
       return false
    }
    let f5 = shell.exec(`curl -sS ${config.contacts.guiService} -o openline-setup/contacts-gui-service.yaml`, {silent: !verbose})
    if (f5.code != 0) {
       error.logError(f5.stderr, 'The file location must have moved.  Please update config/dev.ts with new location', 'Report this issue => https://github.com/openline-ai/openline-cli/issues/new/choose')
       return false
    }
    let f6 = shell.exec(`curl -sS ${config.contacts.guiLoadbalancer} -o openline-setup/contacts-gui-loadbalancer.yaml`, {silent: !verbose})
    if (f6.code != 0) {
       error.logError(f6.stderr, 'The file location must have moved.  Please update config/dev.ts with new location', 'Report this issue => https://github.com/openline-ai/openline-cli/issues/new/choose')
       return false
    }

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