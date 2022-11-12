import {Command, Flags} from '@oclif/core'

export default class Issue extends Command {
  static description = 'Interact with GitHub issues for openline-ai'

  static examples = [
    'openline issue new',
    'openline issue work'
  ]
  static args = [
    {name: 'action', description: 'The type of action to take against github issue [new, work]', required: true},
    {name: 'repo', description: 'The associated openline-ai repository'},
  ]
  static flags = {}

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Issue)
    if (args.action == 'new') {
      this.log('create a new github issue!')
    }
    else if (args.action == 'work') {
      this.log('I will work this issue!')
    }
  }
}