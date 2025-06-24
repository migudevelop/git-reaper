import * as cli from '../src/cli.js'
import { outro } from '@clack/prompts'
import {
  deleteBranchs,
  getBranches,
  printBranches
} from '../src/git-manager.js'
import * as helpers from '../src/helpers.js'

jest.mock('@clack/prompts', () => ({
  outro: jest.fn()
}))

jest.mock('../src/git-manager.js', () => ({
  ...jest.requireActual('../src/git-manager.js'),
  getBranches: jest.fn(),
  deleteBranchs: jest.fn(),
  printBranches: jest.fn()
}))

jest.mock('../src/helpers.js', () => ({
  showConfirmationPrompt: jest.fn(),
  showDeletedBranchesMultiselectPrompt: jest.fn()
}))

describe('cli.js', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.exit = jest.fn()
    jest.mocked(getBranches).mockResolvedValue([])
    jest.mocked(deleteBranchs).mockResolvedValue(true)
    jest.mocked(printBranches).mockResolvedValue()
    jest.mocked(helpers.showConfirmationPrompt).mockResolvedValue(true)
    jest
      .mocked(helpers.showDeletedBranchesMultiselectPrompt)
      .mockResolvedValue([])
  })

  describe('exitCli', () => {
    it('should call outro and process.exit with default message and code', () => {
      const exit = jest.spyOn(process, 'exit').mockImplementation(() => {})
      cli.exitCli()
      expect(outro).toHaveBeenCalled()
      expect(exit).toHaveBeenCalledWith(0)
    })

    it('should call outro and process.exit with custom message', () => {
      const exit = jest.spyOn(process, 'exit').mockImplementation(() => {})
      cli.exitCli('Bye!')
      expect(outro).toHaveBeenCalledWith('Bye!')
      expect(exit).toHaveBeenCalledWith(0)
    })
  })

  describe('initCli', () => {
    const originalArgv = process.argv

    beforeEach(() => {
      process.argv = ['node', 'script']
    })

    afterEach(() => {
      process.argv = originalArgv
    })

    it('should initialize the CLI and parse arguments', async () => {
      await cli.initCli()
      expect(outro).toHaveBeenCalledWith('Thanks for use this cli')
    })

    it('should delete branches if --delete is passed and confirmed, and show success', async () => {
      process.argv = ['node', 'script', '--delete']
      const mockBranches = [{ name: 'main' }]
      jest.mocked(getBranches).mockResolvedValue(mockBranches)
      jest
        .mocked(helpers.showDeletedBranchesMultiselectPrompt)
        .mockResolvedValue(['main'])
      jest.mocked(helpers.showConfirmationPrompt).mockResolvedValue(true)
      jest.mocked(deleteBranchs).mockResolvedValue(true)
      await cli.initCli()
      await new Promise((resolve) => setTimeout(resolve, 200)) // Allow async operations to complete
      expect(deleteBranchs).toHaveBeenCalledWith(['main'])
      expect(outro).toHaveBeenCalledWith(
        expect.stringContaining('Branches deleted successfully.')
      )
    })

    it('should show error if deleteBranchs fails', async () => {
      process.argv = ['node', 'script', '--delete']
      const mockBranches = [{ name: 'main' }]
      jest.mocked(getBranches).mockResolvedValue(mockBranches)
      jest
        .mocked(helpers.showDeletedBranchesMultiselectPrompt)
        .mockResolvedValue(['main'])
      jest.mocked(helpers.showConfirmationPrompt).mockResolvedValue(true)
      jest.mocked(deleteBranchs).mockResolvedValue(false)
      await cli.initCli()
      await new Promise((resolve) => setTimeout(resolve, 200)) // Allow async operations to complete
      expect(deleteBranchs).toHaveBeenCalledWith(['main'])
      expect(outro).toHaveBeenCalledWith(
        expect.stringContaining('Error deleting branches.')
      )
    })

    it('should exit if user does not confirm deletion', async () => {
      process.argv = ['node', 'script', '--delete']
      const mockBranches = [{ name: 'main' }]
      jest.mocked(getBranches).mockResolvedValue(mockBranches)
      jest
        .mocked(helpers.showDeletedBranchesMultiselectPrompt)
        .mockResolvedValue(['main'])
      jest.mocked(helpers.showConfirmationPrompt).mockResolvedValue(false)
      await cli.initCli()
      await new Promise((resolve) => setTimeout(resolve, 200)) // Allow async operations to complete
      expect(deleteBranchs).not.toHaveBeenCalled()
      expect(outro).toHaveBeenCalledWith('Thanks for use this cli')
    })
  })
})
