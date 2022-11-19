import {expect, test} from '@oclif/test'

describe('dev:stop', () => {
  test
  .stdout()
  .command(['dev:stop'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['dev:stop', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
