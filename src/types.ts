import {Moctokit} from '@kie/mock-github'

export type Maybe<T> = T | undefined

type MoctokitInstance = InstanceType<typeof Moctokit>
export type FindPrResponseCollection = NonNullable<
  NonNullable<
    Parameters<
      ReturnType<MoctokitInstance['rest']['pulls']['list']>['reply']
    >[0]
  >['data']
>

export type GetBranchResponse = NonNullable<
  NonNullable<
    Parameters<
      ReturnType<MoctokitInstance['rest']['repos']['getBranch']>['reply']
    >[0]
  >['data']
>

export type CreatePrResponseCollection = NonNullable<
  NonNullable<
    Parameters<
      ReturnType<MoctokitInstance['rest']['pulls']['create']>['reply']
    >[0]
  >['data']
>
export type CreateBranchResponse = NonNullable<
  NonNullable<
    Parameters<
      ReturnType<MoctokitInstance['rest']['git']['createRef']>['reply']
    >[0]
  >['data']
>
