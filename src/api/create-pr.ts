import {Maybe} from './types'
import {getOctokit} from '@actions/github'

export type CreatePrResult = {
  number: number
}

type CreatePrFactoryProps = {
  client: ReturnType<typeof getOctokit>
  owner: string
  repo: string
}

type CreatePrProps = {
  title: string
  body: string
  targetRef: string
  mergeRef: string
}

export function CreatePrFactory({client, owner, repo}: CreatePrFactoryProps) {
  return async function CreatePr({
    title,
    body,
    mergeRef,
    targetRef
  }: CreatePrProps): Promise<Maybe<CreatePrResult>> {
    const {data} = await client.pulls.create({
      owner,
      repo,
      title,
      body,
      base: targetRef,
      head: mergeRef
    })

    return {
      number: data.number
    }
  }
}
