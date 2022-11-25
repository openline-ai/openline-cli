import * as shell from 'shelljs'
import * as error from './errors'

export function deployImage(imageUrl :string, deployYaml :string, serviceYaml :string, loadbalancerYaml? :string, verbose :boolean = false) :boolean {
    let result = true
    let namespace = 'openline'

    let pull = shell.exec(`docker pull ${imageUrl}`, {silent: !verbose})
    if (pull.code != 0) {
        error.logError(pull.stderr, `Unable to pull image ${imageUrl}`)
        return false
    }

    let deploy = shell.exec(`kubectl apply -f ${deployYaml} --namespace ${namespace}`, {silent: !verbose})
    if (deploy.code != 0) {return false}
    let service = shell.exec(`kubectl apply -f ${serviceYaml} --namespace ${namespace}`, {silent: !verbose})
    if (deploy.code != 0) {return false}
    if (loadbalancerYaml != null) {
        let lb = shell.exec(`kubectl apply -f ${loadbalancerYaml} --namespace ${namespace}`, {silent: !verbose})
        if (lb.code != 0) {return false}
    }

    return result
}