import {expect, test} from '@oclif/test'

describe('dev:start', () => {
  test
  .stdout()
  .command(['dev:start'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['dev:start', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
