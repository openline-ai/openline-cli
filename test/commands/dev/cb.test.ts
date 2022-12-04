import {expect, test} from '@oclif/test'

describe('dev:cb', () => {
  test
  .stdout()
  .command(['dev:cb'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['dev:cb', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
