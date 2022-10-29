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
  let branch = await api.getBranch(mergeBranchRef)
  if (!branch) branch = await api.createBranch(mergeBranchRef, sourceRef)
  return branch
}
