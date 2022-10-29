import {Octokit} from '@octokit/rest'

import {Maybe} from './types'

type CreateBranchFactoryProps = {
  client: Octokit
  owner: string
  repo: string
}

export type CreateBranchResult = {
  sha: string
  ref: string
}

export function CreateBranchFactory({
  client,
  owner,
  repo
}: CreateBranchFactoryProps) {
  return async function CreateBranch(
    branchName: string,
    sourceRef: string
  ): Promise<Maybe<CreateBranchResult>> {
    // try {
    //   const {data: branch} = await client.git.getRef({
    //     owner,
    //     repo,
    //     ref: sourceRef
    //   })
    // } catch (error) {
    //   console.error(error)
    // }

    const {data} = await client.git.createRef({
      ref: `refs/heads/${branchName}`,
      sha: sourceRef,
      owner,
      repo
    })

    return {
      sha: data.object.sha,
      ref: data.ref
    }
  }
}
