import {Moctokit} from '@kie/mock-github'
import {faker} from '@faker-js/faker'

import {createApi} from './factory'

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
    const moctokit = new Moctokit()
    moctokit.rest.repos
      .getBranch({
        owner: /.*/,
        repo: /.*/
      })
      .reply({
        status: 200,
        data: {
          name: 'some/branch',
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
    const branch = await api.getBranch('some/branch')
    expect(branch?.sha).toBe(EXPECTED_SHA)
  })
})
