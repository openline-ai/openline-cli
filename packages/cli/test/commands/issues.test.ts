import {expect, test} from '@oclif/test'

describe('issues', () => {
  test
  .stdout()
  .command(['issues'])
  .it('runs issues', ctx => {
    expect(ctx.stdout).to.contain('Labels:')
  })

  test
  .stdout()
  .command(['issues', '--all'])
  .it('runs issues --all', ctx => {
    expect(ctx.stdout).to.contain('Created:')
  })
})
