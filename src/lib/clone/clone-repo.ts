import {logTerminal} from '../../lib/logs'
import * as shell from 'shelljs'

// eslint-disable-next-line max-params
export function cloneRepo(repo: string, verbose: boolean, location?: string, branch?: string, quiet?: boolean) :void {
  let cmd = `git clone ${repo}`
  if (location) {
    cmd += ' ' + location
  }

  if (branch) {
    cmd += ` -b ${branch}`
  }

  if (quiet) {
    cmd += ' -q'
  }

  if (verbose) logTerminal('EXEC', cmd)
  const clone = shell.exec(cmd, {silent: false})
  if (clone.code !== 0) logTerminal('ERROR', clone.stderr)
  if (clone.code === 0) logTerminal('SUCCESS', 'a local copy of the codebase has been created.  Enjoy!')
}
