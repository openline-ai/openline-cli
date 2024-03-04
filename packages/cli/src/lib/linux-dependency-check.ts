import * as deps from './dependencies'
import * as colors from 'colors' // eslint-disable-line no-restricted-imports
const Table = require('cli-table') // eslint-disable-line unicorn/prefer-module

export function installDependencies(verbose: boolean): boolean {
  const notInstalled = colors.red.bold('No')
  const installed = colors.bold.green('Yes')
  // Checking if dependency installed
  const setupDir = deps.setupDirCheck() ? installed : notInstalled
  const git = deps.gitCheck() ? installed : notInstalled
  const docker = deps.dockerCheck() ? installed : notInstalled
  const k3d = deps.k3dCheck() ? installed : notInstalled
  const kubectl = deps.kubeCheck() ? installed : notInstalled
  const helm = deps.helmCheck() ? installed : notInstalled
  const netcat = deps.netcatCheck() ? installed : notInstalled
  const jq = deps.jqCheck() ? installed : notInstalled
  const wget = deps.wgetCheck() ? installed : notInstalled
  const temporal = deps.temporalCheck() ? installed : notInstalled

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
    ['jq', jq],
    ['wget', wget],
    ['temporal', temporal],

  )

  if (verbose) {
    console.log(table.toString())
  }

  // install missing dependencies
  if (setupDir === notInstalled) deps.createSetupDir()
  if (k3d === notInstalled) deps.installK3d()
  if (docker === notInstalled) deps.installDocker()
  if (git === notInstalled) deps.installGit()
  if (helm === notInstalled) deps.installHelm()
  if (kubectl === notInstalled) deps.installKube()
  if (netcat === notInstalled) deps.installNetcat()
  if (jq === notInstalled) deps.installJq()
  if (wget === notInstalled) deps.installWget()
  if (temporal === notInstalled) deps.installTemporal()

  deps.checkDockerGroup()
  return true
}
