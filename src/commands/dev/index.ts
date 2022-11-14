import {Command, Flags} from '@oclif/core'

export default class Dev extends Command {
  static description = 'starts and stops local development server for openline applications'

  static examples = [
    'openline dev --start all',
    'openline dev --start customer-os',
    'openline dev --stop all',
    'openline dev --stop oasis',
  ]

  static flags = {
    start: Flags.string({
      description: 'start openline application', 
      options: ['all', 'customer-os', 'oasis', 'contacts'],  
      required: false,
    }),
    stop: Flags.string({
      description: 'stop openline application', 
      aliases: ['kill', 'k'], 
      options: ['all', 'customer-os', 'oasis', 'contacts'],
      required: false,
    }),
  }

  static args = []

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Dev)

    if (flags.start) {
      console.log(flags.start)
    }
    else if (flags.stop) {
      console.log(flags.stop)
    }
  }
}
