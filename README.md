# Merge Release Hotfix

<p align="center">
  <a href="https://github.com/airtonix/merge-release-hotfix-action/actions/workflows/test.yml">
    <img src="https://github.com/airtonix/merge-release-hotfix-action/actions/workflows/test.yml/badge.svg"/>
  </a>
</p>

Get your release hotfixes back into your mainline.

## Usage

```yml
---
name: "merge-release-hotfix"

"on":
  pull_request:
    types:
      - closed
    branches:
      - release/*

#
# only run one at a time
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}

jobs:
  MergeReleaseHotfix:

    if: github.event.pull_request.merged
    
    runs-on: ubuntu-latest

    permissions:
      contents: write
      pull-requests: write
      issues: write

    steps:
      - uses: actions/checkout@v3

      - name: Self test
        id: selftest
        uses: ./
        with:
          GithubToken: ${{secrets.GITHUB_TOKEN}}
          SourceRef: ${{github.ref_name}}
          TargetRefs: main

```

