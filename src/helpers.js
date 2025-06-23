import { isCancel, multiselect } from '@clack/prompts'
import { exitCli } from './cli.js'
import { bold, cyan, green, yellow } from 'colorette'
import { confirm } from '@clack/prompts'

export const CANCEL_MESSAGE = 'Execution is cancel'
const CURRENT_BRANCH_SYMBOL = '*'

/**
 * Splits and cleans a stdout string into an array of non-empty lines.
 * @param {string} stdout - The stdout string to clean.
 * @returns {string[]} Array of cleaned lines.
 */
export function cleanStdout(stdout) {
  return stdout.trim().split('\n').filter(Boolean)
}

/**
 * Removes ANSI color codes and trims whitespace from each line.
 * @param {string|string[]} lines - Lines to clean (string or array).
 * @returns {string[]} Cleaned lines.
 */
export function cleanLines(lines) {
  // Clean up the output by removing any ANSI color codes and trimming whitespace
  const esc = String.fromCharCode(27)
  const ansiRegex = new RegExp(esc + '\\[[0-?]*[ -/]*[@-~]', 'g')
  return cleanStdout(lines).map((line) => line.replace(ansiRegex, '').trim())
}

/**
 * Creates a branch data object from an array of branch info.
 * @param {string[]} branchData - Array with branch info fields.
 * @returns {object} Branch data object.
 */
export function createBranchData(branchData) {
  return {
    isCurrent: branchData[0] === CURRENT_BRANCH_SYMBOL,
    name: branchData[1],
    commitHash: branchData[2],
    subject: branchData[3],
    authorName: branchData[4],
    committerDate: branchData[5]
  }
}

/**
 * Checks if the prompt was cancelled and exits if so.
 * @param {*} variableToCheck - Value to check for cancellation.
 */
export function checkPrompt(variableToCheck) {
  if (isCancel(variableToCheck)) {
    exitCli(yellow(CANCEL_MESSAGE))
  }
}

/**
 * Shows a multiselect prompt for branches to delete.
 * @param {object[]} branches - Array of branch data objects.
 * @returns {Promise<string[]>} Selected branch names.
 */
export async function showDeletedBranchesMultiselectPrompt(branches) {
  if (branches.length === 0) {
    exitCli('No branches to delete.')
  }
  if (branches.length === 1) {
    exitCli('ℹ️ Only one branch found, no need to delete.')
  }

  const options = branches.map(
    ({ isCurrent, name, commitHash, subject, authorName, committerDate }) => ({
      value: name,
      label: `${isCurrent ? '*' : ' '} ${yellow(name)} (${cyan(commitHash)}): ${subject} - ${authorName} ${green(committerDate)}`,
      hint: isCurrent ? 'Current branch' : undefined
    })
  )

  const deletedBranches = await multiselect({
    message: bold('Select branches to delete:\n'),
    options,
    required: false
  })

  checkPrompt(deletedBranches)

  return deletedBranches
}

/**
 * Shows a confirmation prompt before deleting branches.
 * @returns {Promise<boolean>} True if confirmed, false otherwise.
 */
export async function showConfirmationPrompt() {
  const confirmed = await confirm({
    message: bold(`Are you sure you want to delete the selected branches?`)
  })

  checkPrompt(confirmed)
  return confirmed
}
