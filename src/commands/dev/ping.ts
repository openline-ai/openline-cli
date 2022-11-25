import {Command, Flags} from '@oclif/core'
import * as shell from 'shelljs'

export default class DevPing extends Command {
  static description = 'heath check to determine if openline service is up'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    verbose: Flags.boolean({char: 'v'}),
  }

  static args = [
    {
      name: 'app',
      required: false,
      description: 'the Openline application you would like to ping',
      default: 'customer-os',
      options: ['customer-os'],
    },
  ]

  public async run(): Promise<void> {
    const {flags} = await this.parse(DevPing)

    let cosHealth = shell.exec('curl localhost:10000/health', {silent: true})
    let msHealth = shell.exec('nc -zv -w5 localhost 9009', {silent: true})

    if (msHealth.code === 0) {
      console.log('✅ message store gRPC API is up and reachable on port 9009')
    }
    else {
      console.log('❌ message store gRPC API is not reachable')
      console.log('🦦 try running => openline dev start customer-os')
    }

    if (cosHealth.code === 0) {
      console.log('✅ customerOS GraphQL API is up and reachable on port 10000')
      console.log('🦦 go to http://localhost:10000 in your browser to play around with the graph API explorer')
    } else {
      console.log('❌ customerOS GraphQL API is not reachable')
      console.log('🦦 try running => openline dev start customer-os')
    }
  }
}
