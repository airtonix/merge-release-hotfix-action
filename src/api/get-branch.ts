import {Maybe} from './types'
import {Octokit} from '@octokit/rest'

type GetBranchFactoryProps = {
  client: Octokit
  owner: string
  repo: string
}

export type GetBranchResult = {
  sha: string
  ref: string
}

export function GetBranchFactory({client, owner, repo}: GetBranchFactoryProps) {
  return async function getBranch(
    branch: string
  ): Promise<Maybe<GetBranchResult>> {
    const {data} = await client.repos.getBranch({
      owner,
      repo,
      branch
    })

    return {
      sha: data.commit.sha,
      ref: data.name
    }
  }
}
