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

describe('api/getBranch', () => {
  it('getsBranch', async () => {
    const EXPECTED_SHA = faker.datatype.uuid()
    const SOURCE_BRANCH = 'release/v1.1.1'
    const TARGET_BRANCH = 'main'
    const EXPECTED_TITLE = `${SOURCE_BRANCH} to ${TARGET_BRANCH}`
    const EXPECTED_BODY = `${SOURCE_BRANCH} to ${TARGET_BRANCH}`
    const EXPECTED_BRANCH = `merge/${slugify(SOURCE_BRANCH)}-to-${slugify(
      TARGET_BRANCH
    )}`
    const moctokit = new Moctokit()
    moctokit.rest.repos
      .getBranch({
        owner: /.*/,
        repo: /.*/,
        branch: EXPECTED_BRANCH
      })
      .reply({
        status: 200,
        data: {
          name: EXPECTED_BRANCH,
          commit: {
            sha: EXPECTED_SHA
          }
        } as GetBranchResponse
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
      targetRef: TARGET_BRANCH
    })

    expect(result?.title).toBe(EXPECTED_TITLE)
    expect(result?.body).toBe(EXPECTED_BODY)
    expect(result?.head.ref).toBe(EXPECTED_BRANCH)
  })
})
