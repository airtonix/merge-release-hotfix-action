import * as core from '@actions/core'

import {Context} from './context/context'
import {createApi} from './api'
import {createOrUpdatePr} from './create-or-update-pr'
import {getOrCreateBranch} from './get-or-create-branch'
import {createTemplateFactory} from './content'

async function run(): Promise<void> {
  try {
    const context = new Context()
    const token: string = core.getInput('GithubToken')
    const targetRefs: string = core.getInput('TargetRefs')
    const sourceRef: string = core.getInput('SourceRef')
    const prBranchTemplate: string = core.getInput('PrBranchNameTemplate')
    const prTitleTemplate: string = core.getInput('PrTitleTemlate')
    const prBodyTemplate: string = core.getInput('PrBodyTemplate')
    const repo = context.repo.repo
    const owner = context.repo.owner

    const api = createApi({
      owner,
      repo,
      token
    })
    const templates = createTemplateFactory({
      prBodyTemplate,
      prBranchTemplate,
      prTitleTemplate
    })

    /**
     * Convert string into unique array of target branches to
     * creates Prs for
     */
    const targetRefCollection = Array.from(
      new Set(targetRefs.split(',').map(branch => branch.trim()))
    )

    for (const targetRef of targetRefCollection) {
      await getOrCreateBranch(api, templates, {
        sourceRef,
        targetRef
      })

      await createOrUpdatePr(api, templates, {
        sourceRef,
        targetRef
      })
    }

    // core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
