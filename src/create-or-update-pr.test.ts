import {Moctokit} from '@kie/mock-github'
import {faker} from '@faker-js/faker'

import {createApi} from './api'
import {createTemplateFactory, slugify} from './content'
import {createOrUpdatePr} from './create-or-update-pr'
import type {
  CreatePrResponseCollection,
  FindPrResponseCollection,
  GetBranchResponse
} from './types'

describe('create-or-update-pr', () => {
  it('branch-exists-creates-new-pr', async () => {
    const EXPECTED_SHA = faker.datatype.uuid()
    const SOURCE_BRANCH = 'release/v1.1.1'
    const EXPECTED_TARGET_SHA = faker.git.commitSha()
    const EXPECTED_TARGET_REF = 'main'
    const EXPECTED_TITLE = `${SOURCE_BRANCH} to ${EXPECTED_TARGET_REF}`
    const EXPECTED_BODY = `${SOURCE_BRANCH} to ${EXPECTED_TARGET_REF}`
    const EXPECTED_INTERMEDIATE_BRANCH_SHA = faker.git.commitSha()
    const EXPECTED_INTERMEDIATE_BRANCH_REF = `merge/${slugify(
      SOURCE_BRANCH
    )}-to-${slugify(EXPECTED_TARGET_REF)}`
    const EXPECTED_PR_NUMBER = faker.datatype.number()

    const moctokit = new Moctokit()

    // branch exists
    moctokit.rest.repos
      .getBranch({
        owner: /.*/,
        repo: /.*/,
        branch: EXPECTED_INTERMEDIATE_BRANCH_REF
      })
      .reply({
        status: 200,
        data: {
          name: EXPECTED_INTERMEDIATE_BRANCH_REF,
          commit: {
            sha: EXPECTED_SHA
          }
        } as GetBranchResponse
      })

    // pull request doesn't exist
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
            number: faker.datatype.number(),
            head: {ref: faker.datatype.string()},
            base: {ref: EXPECTED_TARGET_REF}
          }
        ] as FindPrResponseCollection
      })

    // creates new pr
    moctokit.rest.pulls
      .create({
        owner: /.*/,
        repo: /.*/,
        title: EXPECTED_TITLE,
        body: EXPECTED_BODY,
        base: EXPECTED_TARGET_REF,
        head: EXPECTED_INTERMEDIATE_BRANCH_REF
      })
      .reply({
        status: 201,
        data: {
          number: EXPECTED_PR_NUMBER,
          title: EXPECTED_TITLE,
          body: EXPECTED_BODY,
          base: {
            ref: EXPECTED_TARGET_REF,
            sha: EXPECTED_TARGET_SHA
          },
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
    const templates = createTemplateFactory({
      prTitleTemplate: '{{source}} to {{target}}',
      prBodyTemplate: '{{source}} to {{target}}',
      prBranchTemplate: 'merge/{{source}}-to-{{target}}'
    })

    const result = await createOrUpdatePr(api, templates, {
      sourceRef: SOURCE_BRANCH,
      targetRef: EXPECTED_TARGET_REF
    })

    expect(result?.title).toBe(EXPECTED_TITLE)
    expect(result?.body).toBe(EXPECTED_BODY)
    expect(result?.head.ref).toBe(EXPECTED_INTERMEDIATE_BRANCH_REF)
  })

  it('branch-exists-updates-pr', async () => {
    const EXPECTED_SHA = faker.datatype.uuid()
    const SOURCE_BRANCH = 'release/v1.1.1'
    const EXPECTED_TARGET_REF = 'main'
    const EXPECTED_TITLE = `${SOURCE_BRANCH} to ${EXPECTED_TARGET_REF}`
    const EXPECTED_BODY = `${SOURCE_BRANCH} to ${EXPECTED_TARGET_REF}`
    const EXPECTED_INTERMEDIATE_BRANCH_REF = `merge/${slugify(
      SOURCE_BRANCH
    )}-to-${slugify(EXPECTED_TARGET_REF)}`
    const EXPECTED_PR_NUMBER = faker.datatype.number()

    const moctokit = new Moctokit()

    // branch exists
    moctokit.rest.repos
      .getBranch({
        owner: /.*/,
        repo: /.*/,
        branch: EXPECTED_INTERMEDIATE_BRANCH_REF
      })
      .reply({
        status: 200,
        data: {
          name: EXPECTED_INTERMEDIATE_BRANCH_REF,
          commit: {
            sha: EXPECTED_SHA
          }
        } as GetBranchResponse
      })

    // pull request doesn't exist
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
    const templates = createTemplateFactory({
      prTitleTemplate: '{{source}} to {{target}}',
      prBodyTemplate: '{{source}} to {{target}}',
      prBranchTemplate: 'merge/{{source}}-to-{{target}}'
    })

    const result = await createOrUpdatePr(api, templates, {
      sourceRef: SOURCE_BRANCH,
      targetRef: EXPECTED_TARGET_REF
    })

    expect(result?.title).toBe(EXPECTED_TITLE)
    expect(result?.body).toBe(EXPECTED_BODY)
    expect(result?.head.ref).toBe(EXPECTED_INTERMEDIATE_BRANCH_REF)
  })
})
