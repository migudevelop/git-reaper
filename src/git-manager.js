import { exitCli } from './cli.js'
import { cleanLines, createBranchData, execAsync } from './helpers.js'
import { cyan, green, yellow, bold } from 'colorette'

const DELIMITER = '|||'
/**
 * Gets the list of local branches with relevant information.
 * @returns {Promise<object[]>} Array of objects with branch data.
 */
export async function getBranches() {
  const { stdout } = await execAsync(
    `git for-each-ref --sort=committerdate refs/heads/ --format="%(HEAD)${DELIMITER}%(refname:short)${DELIMITER}%(objectname:short)${DELIMITER}%(contents:subject)${DELIMITER}%(authorname)${DELIMITER}(%(committerdate:relative))"`
  )
  return cleanLines(stdout).map((line) =>
    createBranchData(line.split(DELIMITER))
  )
}

/**
 * Deletes one or more local branches.
 * @param {string[]|string} branchs - Name(s) of the branches to delete.
 * @returns {Promise<boolean>} True if deleted successfully, false if there was an error.
 */
export async function deleteBranchs(branchs) {
  const branchsNames = (Array.isArray(branchs) ? branchs : [branchs]).join(' ')
  try {
    await execAsync(`git branch -D ${branchsNames}`)
    return true
  } catch (error) {
    console.error(`Error deleting branch ${branchsNames}:`, error)
    return false
  }
}

/**
 * Prints the list of branches in the terminal with formatting and colors.
 * @returns {Promise<void>} No return value, prints to console.
 */
export async function printBranches() {
  const branches = await getBranches()
  if (branches.length === 0) {
    exitCli('No branches found.')
  }
  branches.forEach(
    ({ isCurrent, name, commitHash, subject, authorName, committerDate }) => {
      const branchText = `${isCurrent ? '*' : ' '} ${yellow(name)} (${cyan(commitHash)}): ${subject} - ${authorName} ${green(committerDate)} ${isCurrent ? cyan('(current branch)') : ''}`
      console.log(isCurrent ? bold(branchText) : branchText)
    }
  )
}
