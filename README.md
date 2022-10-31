<div align="center">

  <img src="docs/logo.svg" alt="logo" width="960" height="auto" />
  <h1>Merge Release Hotfix</h1>
  
  <p>Get your release hotfixes back into your mainline without tainting your release branches.</p>

<!-- Badges -->
<p>
  <a href="https://github.com/airtonix/merge-release-hotfix-action/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/airtonix/merge-release-hotfix-action" alt="contributors" />
  </a>
  <a href="">
    <img src="https://img.shields.io/github/last-commit/airtonix/merge-release-hotfix-action" alt="last update" />
  </a>
  <a href="https://github.com/airtonix/merge-release-hotfix-action/network/members">
    <img src="https://img.shields.io/github/forks/airtonix/merge-release-hotfix-action" alt="forks" />
  </a>
  <a href="https://github.com/airtonix/merge-release-hotfix-action/stargazers">
    <img src="https://img.shields.io/github/stars/airtonix/merge-release-hotfix-action" alt="stars" />
  </a>
  <a href="https://github.com/airtonix/merge-release-hotfix-action/issues/">
    <img src="https://img.shields.io/github/issues/airtonix/merge-release-hotfix-action" alt="open issues" />
  </a>
  <a href="https://github.com/airtonix/merge-release-hotfix-action/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/airtonix/merge-release-hotfix-action.svg" alt="license" />
  </a>
</p>
   
<h4>
    <a href="https://github.com/airtonix/merge-release-hotfix-action/">View Demo</a>
  <span> · </span>
    <a href="https://github.com/airtonix/merge-release-hotfix-action">Documentation</a>
  <span> · </span>
    <a href="https://github.com/airtonix/merge-release-hotfix-action/issues/">Report Bug</a>
  <span> · </span>
    <a href="https://github.com/airtonix/merge-release-hotfix-action/issues/">Request Feature</a>
  </h4>
</div>

<br />

# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)
  - [Features](#dart-features)
- [Getting Started](#toolbox-getting-started)
  - [Prerequisites](#bangbang-prerequisites)
  - [Installation](#gear-installation)
  - [Run Locally](#running-run-locally)
- [Usage](#eyes-usage)
- [Roadmap](#compass-roadmap)
- [Contributing](#wave-contributing)
  - [Code of Conduct](#scroll-code-of-conduct)
- [License](#warning-license)
- [Contact](#handshake-contact)
- [Acknowledgements](#gem-acknowledgements)

## :star2: About the Project

If you follow "something" like gitlab flow with environment branches and:

- 👍️ You think cherrypick based deployment sucks.
- 🚢 you create release snapshot branches that you deploy.
- 🏗️ you fix and redeploy those release branches with hotfix PRs.
- 🙄 Your mainline development branch moves blazingly fast.
- 🤤 Your team want your hotfixes. Yesterday.

Then ...

![tada](./docs/tada.gif)

Welcome to Utopia. :handshake: :thumbsup:

### :dart: Features

- Create multiple PRs target separate branches.
- Creates and updates existing PRs matching source and target branches.

## :toolbox: Getting Started

1. Create a workflow that runs when commits are pushed into a branch
2. Decide what your `target` branche(s) will be.
3. (optional) customise templates for the PR title, body and branchname

## :eyes: Usage

```yml
---
name: 'merge-release-hotfix'

'on':
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
    runs-on: ubuntu-latest

    permissions:
      contents: write
      pull-requests: write
      issues: write

    if: github.event.pull_request.merged

    steps:
      - uses: actions/checkout@v3

      - name: Merge
        uses: '@airtonix/merge-release-hotfix@v1'
        with:
          GithubToken: ${{secrets.GITHUB_TOKEN}}
          SourceRef: ${{github.ref_name}}
          TargetRefs: main
          PrBranchNameTemplate: 'chore/merge-{{source}}-to-{{target}}'
          PrTitleTemlate: 'chore(merge-hotfix): from {{source}} into {{target}}'
          PrBodyTemplate: 'Hotfixes to be merged from: {{source}} into {{target}}'
```

## How it works

Given a target branch `main`, a source branch `release/appone-v1.0.0` and some title, body and branch name templates like

```yml
branch: 'merge-hotfix/{{source}}-to-{{target}}'
title: 'merge-hotfix: {{source}}'
body: 'merge hotfixes from {{source}} to {{target}}'
```

This action, when run will do the following:

1. Looks for an existing branch named `merge-hotfix/release-appone-v1-0-0-to-main`
   - if it doesn't exist then it is created based on `release/appone-v1.0.0`
   - if it exists then `release/appone-v1.0.0` is merged into `merge-hotfix/release-appone-v1-0-0-to-main`
2. Creates a PR with
   - a target of: `main`
   - title: `merge-hotfix: release/appone-v1.0.0`
   - body: `merge hotfixes from release/appone-v1.0.0 to main`
3. From here you can:
   - resolve merge conflicts between `main` and `merge-hotfix/release-appone-v1-0-0-to-main`
   - merge futher changes into `merge-hotfix/release-appone-v1-0-0-to-main`

It looks like this:

```mermaid
%%{init: { 'logLevel': 'debug', 'theme': 'base', 'gitGraph': {'rotateCommitLabel': false}} }%%
gitGraph
  commit id: "(pr #1)"
  commit id: "(pr #2)"
  commit id: "(pr #3)"
  commit id: "(pr #4)"
  branch release/appone-v1.0.0
  commit id: "appone-v1.0.0"
  checkout main
  commit id: "(pr #5)"
  checkout release/appone-v1.0.0
  branch fix/5-oh-no-prod-is-borked
  commit
  checkout main
  commit id: "(pr #6)"
  checkout release/appone-v1.0.0
  merge fix/5-oh-no-prod-is-borked
  checkout main
  branch chore/merge-release-v1.0.0-to-main
  merge release/appone-v1.0.0
  checkout main
  commit id: "(pr #7)"
  checkout chore/merge-release-v1.0.0-to-main
  commit id: "resolve conflicts" type: HIGHLIGHT
  checkout main
  merge chore/merge-release-v1.0.0-to-main
```

## Why not just cherry pick from `main` ?

Probably because:

- you squash your PRs into `main`, so that
- your developers don't have to be so worried about individual commits in their PRs

but more importantly:

- Fixing a bug should be done in the most accurate reflection of the environment in which the bug was discovered.
- If you do this in the development branch, your assumptions about how to fix the bug will be affected by all the other changes that may have drastically changed since you last released.
- It's easier to just stick to simpler mechanics of "Create branch from X, make PR, merge to X"

## Other ways you could achieve this?

Perhaps, lets assume that:

- your mainline development branch is `main`
- you create release snapshot branches as `release/*`

```yml
---
name: 'merge-release-hotfix'

'on':
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
    runs-on: ubuntu-latest

    permissions:
      contents: write
      pull-requests: write
      issues: write

    if: github.event.pull_request.merged

    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
          ref: master

      - name: Reset promotion branch
        run: |
          git fetch origin ${{env.GITHUB_REF_NAME}}:${{env.GITHUB_REF_NAME}}
          git reset --hard ${{env.GITHUB_REF_NAME}}

      - name: Inject slug/short variables
        uses: rlespinasse/github-slug-action@v4

      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v4
        with:
          branch: ${{ format('chore/merge-{0}-to-master', env.GITHUB_REF_SLUG_URL_CS) }}
          base: master
```

In theory it should do what we want, but I could never get this to work. Hence why I created this action.

### :running: Development

Clone the project

```bash
$ git clone https://github.com/airtonix/merge-release-hotfix-action.git
```

Go to the project directory

```bash
$ cd merge-release-hotfix-action
```

Setup tooling (nodejs etc)

```bash
$ ./setup.bash
```

Install deps

```shell
$ npm i
```

## :compass: Roadmap

- [ ] Try to merge target branch into merge branch and write comment if succesful or not
- [ ] Update PR description with stats as it evolves

## :wave: Contributing

[![View contributors to this project](https://raw.github.com/airtonix/merge-release-hotfix-action/master/CONTRIBUTORS.svg?sanitize=true)](https://github.com/airtonix/merge-release-hotfix-action/graphs/contributors)

Contributions are always welcome!

See `contributing.md` for ways to get started.

## :warning: License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more information.

## :handshake: Contact

- [@airtonix](https://github.com/airtonix)

Project Link: [https://github.com/airtonix/merge-release-hotfix-action](https://github.com/airtonix/merge-release-hotfix-action)

## :gem: Acknowledgements

Use this section to mention useful resources and libraries that you have used in your projects.

- [Shields.io](https://shields.io/)
- [Awesome README](https://github.com/matiassingers/awesome-readme)
- [Emoji Cheat Sheet](https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md#travel--places)
- [Readme Template](https://github.com/othneildrew/Best-README-Template)

[![build-test](https://github.com/airtonix/merge-release-hotfix-action/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/airtonix/merge-release-hotfix-action/actions/workflows/test.yml)
