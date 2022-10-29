import {Moctokit} from '@kie/mock-github'
import {faker} from '@faker-js/faker'

import type {CreatePrResponseCollection} from '../types'

import {createApi} from './factory'

describe('api/createPr', () => {
  it('creates the pr', async () => {
    const EXPECTED_PR_TITLE = faker.lorem.sentence()
    const EXPECTED_PR_BODY = faker.lorem.sentence()
    const EXPECTED_PR_NUMBER = faker.datatype.number()
    const EXPECTED_INTERMEDIATE_BRANCH_REF = 'merge/release-v1-1-1-to-main'
    const EXPECTED_INTERMEDIATE_BRANCH_SHA = faker.git.commitSha()
    const EXPECTED_TARGET_REF = 'main'
    const EXPECTED_TARGET_SHA = faker.git.commitSha()
    const moctokit = new Moctokit()
    moctokit.rest.pulls
      .create({
        owner: /.*/,
        repo: /.*/,
        title: EXPECTED_PR_TITLE,
        body: EXPECTED_PR_BODY,
        head: EXPECTED_INTERMEDIATE_BRANCH_REF,
        base: EXPECTED_TARGET_REF
      })
      .reply({
        status: 201,
        data: {
          number: EXPECTED_PR_NUMBER,
          title: EXPECTED_PR_TITLE,
          body: EXPECTED_PR_BODY,
          base: {ref: EXPECTED_TARGET_REF, sha: EXPECTED_TARGET_SHA},
          head: {
            ref: EXPECTED_INTERMEDIATE_BRANCH_REF,
            sha: EXPECTED_INTERMEDIATE_BRANCH_SHA
          }
        } as CreatePrResponseCollection
      })

    const api = createApi({
      owner: 'airtonix',
      repo: 'merge-release-hotfix-action',
      token: 'a-token'
    })
    const pr = await api.createPr({
      targetRef: EXPECTED_TARGET_REF,
      mergeRef: EXPECTED_INTERMEDIATE_BRANCH_REF,
      body: EXPECTED_PR_BODY,
      title: EXPECTED_PR_TITLE
    })
    expect(pr?.number).toBe(EXPECTED_PR_NUMBER)
  })
})
