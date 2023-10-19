import {Command, Flags} from '@oclif/core'
import * as figlet from 'figlet'
import {Octokit} from 'octokit'
import * as dotenv from 'dotenv'
//import { url } from 'inspector'

dotenv.config()

export default class Issues extends Command {
  static description = 'Interact with GitHub issues for openline-ai.  If no flags are set, command will return a list of all open issues assigned to you with a milestone or bug tag.'

  static examples = [
    'openline issues',
    'openline issues -all',
    'openline issues -b',
    'openline issues -new',
  ]

  static flags = {
    all: Flags.boolean({char: 'a', description: 'return all issues assigned to me'}),
    bug: Flags.boolean({char: 'b', description: 'return all bugs assigned to me'}),
    milestone: Flags.boolean({char: 'm', description: 'return all issues tageed to a milestone assigned to me'}),
    new: Flags.boolean({char: 'n', summary: 'create new github issue', description: 'create a new github issue against an openline repo'}),
    token: Flags.string({char: 't', summary: 'github auth token', description: 'overrides the token set in config'}),
    //repo: Flags.string({char: 'r', summary: 'openline-ai repo', description: 'the openline repo that cooresponds with the openline product', options: ['cli', 'customer-os', 'website']}),
  }

  static args = []

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Issues)

    let token = process.env.GITHUB_TOKEN
    if (flags.token) {
      token = flags.token
    }

    // return a list of issues assigned to me across all repos
    const octokit = new Octokit({
      auth: token,
    })

    let resp = await octokit.request('GET /orgs/{org}/issues', {
      org: 'openline-ai',
    })

    console.log('')
    console.log(figlet.textSync('My issues...'))
    console.log('')

    let issueCount = 0

    resp.data.forEach(issue => {

      let labels: any[] = []
      if (issue.labels) {
        issue.labels.forEach((l: any) => {
          labels.push(l.name)
        })
      }

      if (Object.keys(flags).length == 0) {
        if (issue.milestone?.title || labels.includes('bug')) {
          printIssue(issue, labels)
          issueCount++
        }
      }
      else if (flags.milestone && issue.milestone?.title) {
        printIssue(issue, labels)
        issueCount++
      }
      else if (flags.bug && labels.includes('bug')) {
        printIssue(issue, labels)
        issueCount++
      }
      else if (flags.all) {
        printIssue(issue, labels)
        issueCount++
      }
    })
    console.log('Your open issues: ', issueCount)


    // create a new issue
    if (flags.new) {
      console.log('')
      console.log(figlet.textSync('Log a new issue...'))
      console.log('New issue against ', flags.repo)
    }
  }
}

// Print issues
function printIssue(issue: any, labels: string[]) {

  let url = issue.html_url
  let issueNumber = issue.number
  let issueId = issue.id
  let title = issue.title
  let milestone = issue.milestone?.title
  let created = issue.created_at
  let repository = issue.repository?.name

  console.log(repository, ' #', issueNumber, ' ', title, ' - ', issueId)
  console.log(url)
  console.log('Labels: ', labels)
  console.log('Milestones: ', milestone)
  console.log('Created: ', created)
  console.log('')
}
