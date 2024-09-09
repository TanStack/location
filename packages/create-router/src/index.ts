import { basename, resolve } from 'node:path'
import { existsSync } from 'node:fs'

import { input, select } from '@inquirer/prompts'
import { cli } from './cli'
import {
  DEFAULT_BUNDLER,
  DEFAULT_PACKAGE_MANAGER,
  SUPPORTED_BUNDLERS,
  SUPPORTED_PACKAGE_MANAGERS,
} from './constants'
import { validateProjectName } from './utils/validateProjectName'
import { create } from './create'
import { isEmptyDirectory } from './utils/isEmptyDirectory'

async function main() {
  // project cannot be built if packages are not installed
  if (cli.options.skipInstall === true) {
    cli.options.skipInstall = true
  }

  if (!cli.options.packageManager) {
    cli.options.packageManager = await select({
      message: 'Select a package manager',
      choices: SUPPORTED_PACKAGE_MANAGERS.map((pm) => ({ value: pm })),
      default: DEFAULT_PACKAGE_MANAGER,
    })
  }

  if (!cli.directory) {
    cli.directory = await input({
      message: 'Enter the project name',
      default: 'my-router-app',
      validate: (name) => {
        const validation = validateProjectName(basename(resolve(name)))
        if (validation.valid) {
          return true
        }
        return 'Invalid project name: ' + validation.problems[0]
      },
    })
  }

  if (!cli.options.bundler) {
    cli.options.bundler = await select({
      message: 'Select a bundler',
      choices: SUPPORTED_BUNDLERS.map((bundler) => ({ value: bundler })),
      default: DEFAULT_BUNDLER,
    })
  }

  const targetFolder = resolve(cli.directory)
  const projectName = basename(targetFolder)

  if (existsSync(targetFolder) && !(await isEmptyDirectory(targetFolder))) {
    const dir =
      cli.directory === '.'
        ? 'Current directory'
        : `Target directory "${targetFolder}"`
    const message = `${dir} is not empty. Please choose how to proceed:`
    const action = await select({
      message,
      choices: [
        { name: 'Cancel', value: 'cancel' },
        { name: 'Ignore files and continue', value: 'ignore' },
      ],
    })
    if (action === 'cancel') {
      process.exit(1)
    }
  }

  await create({
    targetFolder,
    projectName,
    skipInstall: cli.options.skipInstall,
    skipBuild: cli.options.skipBuild,
    packageManager: cli.options.packageManager,
    bundler: cli.options.bundler,
  })
}

main().catch(console.error)
