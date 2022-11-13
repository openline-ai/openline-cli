import {Command, Flags} from '@oclif/core'
import * as figlet from 'figlet'
import {Octokit} from 'octokit'
import * as dotenv from 'dotenv'
//import { url } from 'inspector'

dotenv.config()

export default class Issue extends Command {
  static description = 'Interact with GitHub issues for openline-ai'

  static examples = [
    'openline issue new',
    'openline issue work'
  ]
  
  static flags = {
    bug: Flags.boolean({char: 'b', description: 'return all bugs assigned to me'}),
    milestone: Flags.boolean({char: 'm', description: 'return all issues tageed to a milestone assigned to me'}),
    //new: Flags.boolean({char: 'n', summary: 'create new github issue', description: 'create a new github issue against an openline repo'}),
    //repo: Flags.string({char: 'r', summary: 'openline-ai repo', description: 'the openline repo that cooresponds with the openline product', options: ['cli', 'customer-os', 'contacts', 'oasis', 'website']}),
  }
  
  static args = []

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Issue)
    
    // return a list of issues assigned to me across all repos
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    })

    let resp = await octokit.request('GET /orgs/{org}/issues', {
      org: 'openline-ai',
    })

    console.log('')
    console.log(figlet.textSync('My issues...'))
    console.log('')

    let issueCount = 0

    resp.data.forEach(issue => {
      if (flags.milestone && issue.milestone?.title) {
        printIssue(issue)
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

function printIssue(issue: any) {
  let labels :string[] = []
  if (issue.labels) {
    issue.labels.forEach((l: { name: string }) => {
      labels.push(l.name)
    })
  }
  
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