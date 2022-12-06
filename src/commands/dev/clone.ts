import {Command, Flags} from '@oclif/core'
import {getConfig} from '../../config/dev'
import {cloneRepo} from '../../lib/clone/clone-repo'

export default class DevClone extends Command {
  static description = 'Create a local copy of an Openline code repository'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static aliases = ['dev:clc']

  static flags = {
    branch: Flags.string({
      char: 'b',
      description: 'the name of the branch you would like to clone',
    }),
    verbose: Flags.boolean({
      char: 'v',
    }),
  }

  static args = [
    {
      name: 'app',
      required: true,
      description: 'the openline codebase you want to copy locally',
      options: [
        'contacts',
        'cli',
        'customer-os',
        'oasis',
        'voice',
        'webchat',
        'website',
      ],
    },
    {
      name: 'location',
      description: 'the location on your computer where you would like to put the cloned codebase',
    },
  ]

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(DevClone)
    const config = getConfig()

    const app = args.app
    switch (app) {
    case 'contacts':
      cloneRepo(config.contacts.repo, flags.verbose, args.location, flags.branch)
      break
    case 'cli':
      cloneRepo(config.cli.repo, flags.verbose, args.location, flags.branch)
      break
    case 'customer-os':
      cloneRepo(config.customerOs.repo, flags.verbose, args.location, flags.branch)
      break
    case 'oasis':
      cloneRepo(config.oasis.repo, flags.verbose, args.location, flags.branch)
      break
    case 'voice':
      cloneRepo(config.voice.repo, flags.verbose, args.location, flags.branch)
      break
    case 'webchat':
      cloneRepo(config.webchat.repo, flags.verbose, args.location, flags.branch)
      break
    case 'website':
      cloneRepo(config.website.repo, flags.verbose, args.location, flags.branch)
      break
    }
  }
}
