import {Moctokit} from '@kie/mock-github'
import {faker} from '@faker-js/faker'

import type {FindPrResponseCollection} from '../types'

import {createApi} from './factory'

describe('api/findBranchPr', () => {
  it('finds the pr', async () => {
    const EXPECTED_PR_NUMBER = faker.datatype.number()
    const EXPECTED_INTERMEDIATE_BRANCH_REF = 'merge/release-1-1-1-to-main'
    const EXPECTED_TARGET_REF = 'main'
    const moctokit = new Moctokit()
    moctokit.rest.pulls
      .list({
        owner: /.*/,
        repo: /.*/
      })
      .reply({
        status: 200,
        data: [
          {
            number: faker.datatype.number(),
            head: {ref: faker.datatype.string()},
            base: {ref: EXPECTED_TARGET_REF}
          },
          {
            number: faker.datatype.number(),
            head: {ref: faker.datatype.string()},
            base: {ref: EXPECTED_TARGET_REF}
          },
          {
            number: EXPECTED_PR_NUMBER,
            head: {ref: EXPECTED_INTERMEDIATE_BRANCH_REF},
            base: {ref: EXPECTED_TARGET_REF}
          },
          {
            number: faker.datatype.number(),
            head: {ref: faker.datatype.string()},
            base: {ref: EXPECTED_TARGET_REF}
          }
        ] as FindPrResponseCollection
      })

    const api = createApi({
      owner: 'airtonix',
      repo: 'merge-release-hotfix-action',
      token: 'a-token'
    })
    const pr = await api.findBranchPr({
      targetRef: EXPECTED_TARGET_REF,
      branchName: EXPECTED_INTERMEDIATE_BRANCH_REF
    })
    expect(pr?.number).toBe(EXPECTED_PR_NUMBER)
  })
})
