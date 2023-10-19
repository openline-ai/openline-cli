import {logTerminal} from '../../lib/logs'
import * as shell from 'shelljs'

// eslint-disable-next-line max-params
export function cloneRepo(repo: string, verbose: boolean, location?: string, branch?: string, quiet?: boolean) :void {
  let defaultLocation = process.cwd(); // Get the current working directory as the default location
  let cmd = `git clone ${repo}`;
  if (location) {
    cmd += ' ' + location;
  } else {
    cmd += ' ' + defaultLocation;
  }

  logTerminal('INFO', `The location looks like this        >>>>>>>>>> ${location}`); // Log the target directory
  logTerminal('INFO', `The defaultLocation looks like this >>>>>>>>>> ${defaultLocation}`); // Log the target directory
  logTerminal('INFO', `The repo looks like this            >>>>>>>>>> ${repo}`); // Log the target directory
  logTerminal('INFO', `The cmd command looks like this     >>>>>>>>>> ${cmd}`); // Log the target directory
  logTerminal('INFO', `Cloning into                        >>>>>>>>>> ${defaultLocation}`); // Log the target directory

  if (branch) {
    cmd += ` -b ${branch}`
  }

  if (quiet) {
    cmd += ' -q'
  }

  if (verbose) logTerminal('EXEC', cmd)
  const clone = shell.exec(cmd, {silent: false})
  if (clone.code !== 0) logTerminal('ERROR', clone.stderr)
  if (clone.code === 0 && !quiet) logTerminal('SUCCESS', 'a local copy of the codebase has been created.  Enjoy!')
}
