import * as deps from './dependencies'
import * as colors from 'colors' // eslint-disable-line no-restricted-imports
const Table = require('cli-table') // eslint-disable-line unicorn/prefer-module

export function installDependencies(verbose: boolean) :boolean {
  // Checking if dependency installed
  const setupDir = deps.setupDirCheck() ? colors.bold.green('Yes') : colors.red.bold('No')
  const git = deps.gitCheck() ? colors.bold.green('Yes') : colors.red.bold('No')
  const docker = deps.dockerCheck() ? colors.bold.green('Yes') : colors.red.bold('No')
  const k3d = deps.k3dCheck() ? colors.bold.green('Yes') : colors.red.bold('No')
  const kubectl = deps.kubeCheck() ? colors.bold.green('Yes') : colors.red.bold('No')
  const helm = deps.helmCheck() ? colors.bold.green('Yes') : colors.red.bold('No')
  const netcat = deps.netcatCheck() ? colors.bold.green('Yes') : colors.red.bold('No')
  const ory = deps.oryCheck() ? colors.bold.green('Yes') : colors.red.bold('No')
  const jq = deps.jqCheck() ? colors.bold.green('Yes') : colors.red.bold('No')

  const table = new Table({
    head: [colors.cyan.bold('Dependency'), colors.cyan.bold('Installed?')],
  })

  table.push(
    ['k3d', k3d],
    ['docker', docker],
    ['git', git],
    ['helm', helm],
    ['kubectl', kubectl],
    ['netcat', netcat],
    ['ory', ory],
    ['jq', jq],

  )

  if (verbose) {
    console.log(table.toString())
  }

  const notInstalled = colors.red.bold('No')

  // install missing dependencies
  if (setupDir === notInstalled) deps.createSetupDir()
  if (k3d === notInstalled) deps.installK3d()
  if (docker === notInstalled) deps.installDocker()
  if (git === notInstalled) deps.installGit()
  if (helm === notInstalled) deps.installHelm()
  if (kubectl === notInstalled) deps.installKube()
  if (netcat === notInstalled) deps.installNetcat()
  if (ory === notInstalled) deps.installOry()
  if (jq === notInstalled) deps.installJq()

  deps.checkDockerGroup()
  return true
}
