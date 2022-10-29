import {Api} from './api'

type GetOrCreateBranchProps = {
  /** api wrapper */
  api: Api
  /** gitref to create branch from */
  sourceRef: string
  /** branch name to ensure exists */
  mergeBranchRef: string
}

export async function getOrCreateBranch({
  api,
  sourceRef,
  mergeBranchRef
}: GetOrCreateBranchProps): Promise<
  ReturnType<Api['getBranch'] | Api['createBranch']>
> {
  const sourceBranch = await api.getBranch(sourceRef)
  if (!sourceBranch) throw Error('Source branch not found')

  const branch = await api.createBranch({
    branchName: mergeBranchRef,
    sourceSha: sourceBranch.sha
  })

  return branch
}
