import {Command, Flags} from '@oclif/core'
import {getHelpFlagAdditions} from '@oclif/core/lib/help'
import * as shell from 'shelljs'
import {dependencies} from '../../checks/mac'

export default class Dev extends Command {
  static description = 'starts and stops local development server for openline applications'

  static examples = [
    'openline dev --start all',
    'openline dev --start customer-os',
    'openline dev --stop',
    'openline dev -p customer-os',
  ]

  /*static flags = {
    kill: Flags.boolean({
      char: 'k',
      description: 'kill all openline services'
    }),
    ping: Flags.string({
      description: 'service health check',
      char: 'p', 
      options: ['all', 'customer-os', 'oasis', 'contacts'], 
    }),
    start: Flags.string({
      description: 'start openline application', 
      options: ['all', 'customer-os', 'oasis', 'contacts'],  
    }),
    status: Flags.boolean({
      description: 'current status of kubernetes cluser',
    }),
    stop: Flags.boolean({
      description: 'stop openline applications', 
    }),
    verbose: Flags.boolean({
      description: 'enable verbose logging to terminal',
      char: 'v'
    })
  }

  static args = []



    else if (flags.ping == 'customer-os') {
      
      else {
        console.log('❌ customerOS API is not reachable')
        console.log('🦦 run [openline dev --start customer-os] to start the customerOS dev server.')
      }
    }
    
    else if (flags.status) {
      let isUp = shell.exec('kubectl get services', {silent: !flags.verbose})
      if (isUp.code == 0) {
        console.log('🦦 k8s cluster')
        shell.exec('kubectl get services')
        shell.exec('kubectl get services -n openline')
        console.log('')
        console.log('🦦 k8s pods: openline')
        shell.exec('kubectl get pods -n openline -o wide')
        console.log('🦦 k8s pods: kube-system')
        shell.exec('kubectl get pods -n kube-system -o wide')
        console.log('')
        console.log('🦦 k8s persistent volumes')
        shell.exec('kubectl get pv')
      }
      else {
        console.log('❌ Openline services are not running')
        console.log('🦦 Please run [openline dev --start] to start services')
      }
    }
  }
}
  
*/
public async run(): Promise<void> {
  const {args, flags} = await this.parse(Dev)}
}