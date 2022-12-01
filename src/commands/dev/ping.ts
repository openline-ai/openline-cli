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
    // const {flags} = await this.parse(DevPing)

    console.log('🦦 customerOS endpoints')
    const cosHealth = shell.exec('curl localhost:10000/health', {silent: true})
    const msHealth = shell.exec('nc -zv -w5 localhost 9009', {silent: true})

    if (msHealth.code === 0) {
      console.log('✅ message store gRPC API is up and reachable on port 9009')
    } else {
      console.log('❌ message store gRPC API is not reachable')
    }

    if (cosHealth.code === 0) {
      console.log('✅ customerOS GraphQL API is up and reachable on port 10000')
    } else {
      console.log('❌ customerOS GraphQL API is not reachable')
    }

    if (cosHealth.code !== 0 || msHealth.code !== 0) {
      console.log('=> Try running openline dev start customer-os')
    }

    console.log('')
    console.log('🦦 oasis endpoints')
    const oasisApi = shell.exec('curl localhost:8006/health', {silent: true})
    const channelsApi = shell.exec('curl localhost:8013/health', {silent: true})

    if (oasisApi.code === 0) {
      console.log('✅ Oasis API is up and reachable on port 8006')
    } else {
      console.log('❌ Oasis API is not reachable')
    }

    if (channelsApi.code === 0) {
      console.log('✅ Channels API is up and reachable on port 8013')
    } else {
      console.log('❌ Channels API is not reachable')
    }

    if (oasisApi.code !== 0 || channelsApi.code !== 0) {
      console.log('=> Try running openline dev start oasis')
    }
  }
}
