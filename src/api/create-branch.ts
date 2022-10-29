import {Octokit} from '@octokit/rest'

import {GetBranchFactory} from './get-branch'
import {Maybe} from './types'

type CreateBranchFactoryProps = {
  client: Octokit
  owner: string
  repo: string
}
type CreateBranchProps = {
  branchName: string
  sourceSha: string
}
export type CreateBranchResult = {
  sha: string
  ref: string
}
type CreateBranchFn = ({
  branchName,
  sourceSha
}: CreateBranchProps) => Promise<Maybe<CreateBranchResult>>

export function CreateBranchFactory({
  client,
  owner,
  repo
}: CreateBranchFactoryProps): CreateBranchFn {
  const getBranch = GetBranchFactory({client, owner, repo})
  return async function CreateBranch({
    branchName,
    sourceSha
  }: CreateBranchProps): Promise<Maybe<CreateBranchResult>> {
    const branch = await getBranch(branchName)
    if (branch) return {sha: branch.sha, ref: branch.ref}

    const {data} = await client.git.createRef({
      ref: `refs/heads/${branchName}`,
      sha: sourceSha,
      owner,
      repo
    })

    return {
      sha: data.object.sha,
      ref: data.ref
    }
  }
}
