import * as helpers from '../src/helpers.js'
import { multiselect, confirm, isCancel } from '@clack/prompts'
import * as cli from '../src/cli.js'

jest.mock('@clack/prompts', () => ({
  multiselect: jest.fn(),
  confirm: jest.fn(),
  isCancel: jest.fn()
}))

describe('helpers.js', () => {
  describe('cleanStdout', () => {
    it('should split and clean stdout into non-empty lines', () => {
      const input = 'line1\n\nline2\n  \nline3\n'
      expect(helpers.cleanStdout(input)).toEqual([
        'line1',
        'line2',
        '  ',
        'line3'
      ])
    })
  })

  describe('cleanLines', () => {
    it('should remove ANSI codes and trim whitespace', () => {
      const esc = String.fromCharCode(27)
      const input = `${esc}[31m red line ${esc}[0m\n  normal line  `
      expect(helpers.cleanLines(input)).toEqual(['red line', 'normal line'])
    })
  })

  describe('createBranchData', () => {
    it('should create a branch data object from array', () => {
      const arr = ['*', 'main', 'abc123', 'msg', 'author', 'date']
      expect(helpers.createBranchData(arr)).toEqual({
        isCurrent: true,
        name: 'main',
        commitHash: 'abc123',
        subject: 'msg',
        authorName: 'author',
        committerDate: 'date'
      })
    })
  })

  describe('checkPrompt', () => {
    it('should call exitCli if isCancel returns true', () => {
      const mockExit = jest.fn()
      isCancel.mockReturnValue(true)
      jest.spyOn(cli, 'exitCli').mockImplementation(mockExit)
      helpers.checkPrompt('cancel')
      expect(mockExit).toHaveBeenCalled()
      jest.restoreAllMocks()
    })
    it('should not call exitCli if isCancel returns false', () => {
      const mockExit = jest.fn()
      isCancel.mockReturnValue(false)
      jest.spyOn(cli, 'exitCli').mockImplementation(mockExit)
      helpers.checkPrompt('ok')
      expect(mockExit).not.toHaveBeenCalled()
      jest.restoreAllMocks()
    })
  })

  describe('showDeletedBranchesMultiselectPrompt', () => {
    it('should exit if branches is empty', async () => {
      const mockExit = jest.fn()
      jest.spyOn(cli, 'exitCli').mockImplementation(mockExit)
      await helpers.showDeletedBranchesMultiselectPrompt([])
      expect(mockExit).toHaveBeenCalledWith('No branches to delete.')
      jest.restoreAllMocks()
    })
    it('should exit if only one branch', async () => {
      const mockExit = jest.fn()
      jest.spyOn(cli, 'exitCli').mockImplementation(mockExit)
      await helpers.showDeletedBranchesMultiselectPrompt([{ name: 'main' }])
      expect(mockExit).toHaveBeenCalledWith(
        'ℹ️ Only one branch found, no need to delete.'
      )
      jest.restoreAllMocks()
    })
    it('should return selected branches', async () => {
      const branches = [
        {
          isCurrent: false,
          name: 'dev',
          commitHash: 'a',
          subject: 's',
          authorName: 'a',
          committerDate: 'd'
        },
        {
          isCurrent: false,
          name: 'main',
          commitHash: 'b',
          subject: 't',
          authorName: 'b',
          committerDate: 'e'
        }
      ]
      multiselect.mockResolvedValue(['dev'])
      jest.spyOn(helpers, 'checkPrompt').mockImplementation(() => {})
      const result =
        await helpers.showDeletedBranchesMultiselectPrompt(branches)
      expect(result).toEqual(['dev'])
      jest.restoreAllMocks()
    })
  })

  describe('showConfirmationPrompt', () => {
    it('should return true if confirmed', async () => {
      confirm.mockResolvedValue(true)
      jest.spyOn(helpers, 'checkPrompt').mockImplementation(() => {})
      const result = await helpers.showConfirmationPrompt()
      expect(result).toBe(true)
      jest.restoreAllMocks()
    })
    it('should return false if not confirmed', async () => {
      confirm.mockResolvedValue(false)
      jest.spyOn(helpers, 'checkPrompt').mockImplementation(() => {})
      const result = await helpers.showConfirmationPrompt()
      expect(result).toBe(false)
      jest.restoreAllMocks()
    })
  })
})
