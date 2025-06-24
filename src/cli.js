#!/usr/bin/env node
import { Command } from 'commander'
import { deleteBranchs, getBranches, printBranches } from './git-manager.js'
import {
  showConfirmationPrompt,
  showDeletedBranchesMultiselectPrompt
} from './helpers.js'
import { outro } from '@clack/prompts'
import { greenBright, redBright } from 'colorette'

const EXIT_APP_MESSAGE = 'Thanks for use this cli'
const CANCEL_CODE = 0

/**
 * Initializes the git-reaper CLI and defines the main options and actions.
 */
export function initCli() {
  const program = new Command()
  program
    .name('git-reaper')
    .description('List and delete old git branches')
    .version('0.1.0')
    .option('-d, --delete', 'Delete branches')
    .action(async (options) => {
      if (options?.delete) {
        const branches = await getBranches()
        const selectedBranches =
          await showDeletedBranchesMultiselectPrompt(branches)

        const confirmed = await showConfirmationPrompt()

        if (confirmed) {
          const deleteResult = await deleteBranchs(selectedBranches)
          if (deleteResult) {
            exitCli(greenBright('Branches deleted successfully.'))
          } else {
            exitCli(redBright('Error deleting branches.'))
          }
        }
        exitCli()
      }
      await printBranches()
      exitCli()
    })

  program.parse(process.argv)
}

/**
 * Ends the CLI execution showing an exit message.
 * @param {string} [message=EXIT_APP_MESSAGE] - Message to display before exiting.
 */
export function exitCli(message = EXIT_APP_MESSAGE) {
  outro(message)
  process.exit(CANCEL_CODE)
}
