import {Moctokit} from '@kie/mock-github'
import {faker} from '@faker-js/faker'

import {createApi} from './api'
import type {GetBranchResponse} from './types'

describe('api/getBranch', () => {
  it('getsBranch', async () => {
    const EXPECTED_SHA = faker.datatype.uuid()
    const moctokit = new Moctokit()
    moctokit.rest.repos
      .getBranch({
        owner: /.*/,
        repo: /.*/,
        branch: /.*/
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
