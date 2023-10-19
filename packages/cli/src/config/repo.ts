export function getRepos() :any {
  const repos: any = {}

  repos.baseUrl = 'https://github.com/openline-ai/'

  repos.cli = 'openline-cli'
  repos.customerOs = 'openline-customer-os'
  repos.uiKit = 'openline-ui-kit'
  repos.voice = 'openline-voice'
  repos.website = 'openline.ai'
  repos.webchat = 'openline-web-chat'

  return repos
}
