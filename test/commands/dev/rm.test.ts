import {expect, test} from '@oclif/test'

describe('dev:rm', () => {
  test
  .stdout()
  .command(['dev:rm'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['dev:rm', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
