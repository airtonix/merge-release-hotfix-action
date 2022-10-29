import {Moctokit} from '@kie/mock-github'
import {faker} from '@faker-js/faker'

import {createApi} from './api'
import {createTemplateFactory, slugify} from './content'
import {createOrUpdatePr} from './create-or-update-pr'

type MoctokitInstance = InstanceType<typeof Moctokit>
type GetBranchResponse = NonNullable<
  NonNullable<
    Parameters<
      ReturnType<MoctokitInstance['rest']['repos']['getBranch']>['reply']
    >[0]
  >['data']
>
type FindPrResponseCollection = NonNullable<
  NonNullable<
    Parameters<
      ReturnType<MoctokitInstance['rest']['pulls']['list']>['reply']
    >[0]
  >['data']
>

describe('create-or-update-pr', () => {
  it('creates-new-pr', async () => {
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
