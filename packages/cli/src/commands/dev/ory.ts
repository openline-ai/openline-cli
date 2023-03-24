import {Command, Flags} from '@oclif/core'
import {getConfig} from '../../config/dev'
import {installOryTunnel} from '../../lib/dev/customer-os'
const { spawn } = require('child_process')
import {logTerminal} from '../../lib/logs'
import {cloneRepo} from '../../lib/clone/clone-repo'
import { cleanupSetupFiles } from '../../lib/dev/start'



export default class DevOry extends Command {
  static description = 'view current status of all Openline services'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    verbose: Flags.boolean({char: 'v'}),
  }

  static args = [
    {
      name: 'action',
      required: true,
      description: 'ory action to perform',
      options: [
        'tunnel'
      ],
    },
  ]

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(DevOry)
    const config = getConfig()

    const action = args.action
    switch (action) {
      case 'tunnel':
        logTerminal('INFO', 'Starting Ory Tunnel...')
        cleanupSetupFiles()
        cloneRepo(config.customerOs.repo, flags.verbose, config.setupDir, undefined, true)
        installOryTunnel(config.customerOs.repo, flags.verbose)
        cleanupSetupFiles()
        const shell = spawn('kubectl',['-n', 'openline', 'exec', '-it', 'ory-tunnel-0', '--', 'tunnel.sh'], { stdio: 'inherit', shell: true })
        break
    }
  }
}
