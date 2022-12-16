import {expect, test} from '@oclif/test'

describe('dev:clone', () => {
  test
  .stdout()
  .command(['dev:clone'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['dev:clone', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
