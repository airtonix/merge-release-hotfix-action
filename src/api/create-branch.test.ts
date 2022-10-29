import {Moctokit} from '@kie/mock-github'
import {faker} from '@faker-js/faker'

import {createApi} from './factory'

type MoctokitInstance = InstanceType<typeof Moctokit>
type CreateBranchResponse = NonNullable<
  NonNullable<
    Parameters<
      ReturnType<MoctokitInstance['rest']['git']['createRef']>['reply']
    >[0]
  >['data']
>
type GetBranchResponse = NonNullable<
  NonNullable<
    Parameters<
      ReturnType<MoctokitInstance['rest']['repos']['getBranch']>['reply']
    >[0]
  >['data']
>

describe('api/createBranch', () => {
  it('creates the branch', async () => {
    const EXPECTED_BRANCH_NAME = 'merge/release-v1-1-1-to-main'
    const EXPECTED_SOURCE_SHA = faker.git.commitSha()
    const moctokit = new Moctokit()

    // branch doesn't exist yet
    moctokit.rest.repos
      .getBranch({
        owner: /.*/,
        repo: /.*/,
        branch: /.*/
      })
      .reply({
        status: 404,
        data: {}
      })
    // we created it
    moctokit.rest.git
      .createRef({
        owner: /.*/,
        repo: /.*/,
        ref: /.*/,
        sha: /.*/
      })
      .reply({
        status: 201,
        data: {
          ref: EXPECTED_BRANCH_NAME,
          object: {
            sha: EXPECTED_SOURCE_SHA
          }
        } as CreateBranchResponse
      })

    const api = createApi({
      owner: 'airtonix',
      repo: 'merge-release-hotfix-action',
      token: 'a-token'
    })

    const pr = await api.createBranch({
      branchName: EXPECTED_BRANCH_NAME,
      sourceSha: EXPECTED_SOURCE_SHA
    })

    expect(pr?.ref).toBe(EXPECTED_BRANCH_NAME)
    expect(pr?.sha).toBe(EXPECTED_SOURCE_SHA)
  })

  it('returns existing branch', async () => {
    const EXPECTED_BRANCH_NAME = 'merge/release-v1-1-1-to-main'
    const EXPECTED_SOURCE_SHA = faker.git.commitSha()
    const moctokit = new Moctokit()

    // branch exists
    moctokit.rest.repos
      .getBranch({
        owner: /.*/,
        repo: /.*/,
        branch: /.*/
      })
      .reply({
        status: 200,
        data: {
          name: EXPECTED_BRANCH_NAME,
          commit: {
            sha: EXPECTED_SOURCE_SHA
          }
        } as GetBranchResponse
      })

    const api = createApi({
      owner: 'airtonix',
      repo: 'merge-release-hotfix-action',
      token: 'a-token'
    })

    const pr = await api.createBranch({
      branchName: EXPECTED_BRANCH_NAME,
      sourceSha: EXPECTED_SOURCE_SHA
    })

    expect(pr?.ref).toBe(EXPECTED_BRANCH_NAME)
    expect(pr?.sha).toBe(EXPECTED_SOURCE_SHA)
  })
})
