import {exit} from 'node:process'
import * as shell from 'shelljs'

export function logError(desc: string, suggestion: string, shutdown = false) :void {
  console.log('❌', desc)
  console.log(suggestion)
  console.log('Report this issue => https://github.com/openline-ai/openline-cli/issues/new/choose')

  shell.exec('rm -r openline-setup', {silent: true})
  if (shutdown) {
    console.log('')
    console.log('🦦 shutting down dev server...')
    shell.exec('colima delete -f', {silent: true})
    exit(1)
  }
}
