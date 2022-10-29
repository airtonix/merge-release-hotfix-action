import * as core from '@actions/core'
import {Octokit} from '@octokit/rest'

import {Maybe} from './types'

type GetBranchFactoryProps = {
  client: Octokit
  owner: string
  repo: string
}

export type GetBranchResult = {
  sha: string
}

export function GetBranchFactory({client, owner, repo}: GetBranchFactoryProps) {
  return async function getBranch(
    branch: string
  ): Promise<Maybe<GetBranchResult>> {
    try {
      const {data} = await client.repos.getBranch({
        owner,
        repo,
        branch
      })

      return {sha: data.commit.sha}
    } catch (error) {
      core.error(`Couldn't find branch ${branch}`)
    }
    return
  }
}
