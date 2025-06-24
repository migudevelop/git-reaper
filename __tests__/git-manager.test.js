import * as gitManager from '../src/git-manager.js'
import * as cli from '../src/cli.js'
import * as helpers from '../src/helpers.js'

jest.mock('../src/cli.js', () => ({
  exitCli: jest.fn()
}))

describe('git-manager.js', () => {
  let originalLog, originalError

  beforeEach(() => {
    originalLog = console.log
    originalError = console.error
    console.log = jest.fn()
    console.error = jest.fn()
  })

  afterEach(() => {
    console.log = originalLog
    console.error = originalError
    jest.restoreAllMocks()
  })

  describe('getBranches', () => {
    it('should return parsed branch data', async () => {
      const mockLines = [
        '*|||main|||abc123|||msg|||author|||date',
        ' |||dev|||def456|||msg2|||author2|||date2'
      ]
      const mockBranchData = [
        {
          isCurrent: true,
          name: 'main',
          commitHash: 'abc123',
          subject: 'msg',
          authorName: 'author',
          committerDate: 'date'
        },
        {
          isCurrent: false,
          name: 'dev',
          commitHash: 'def456',
          subject: 'msg2',
          authorName: 'author2',
          committerDate: 'date2'
        }
      ]
      jest.spyOn(helpers, 'execAsync').mockResolvedValue({ stdout: 'mock' })
      jest.spyOn(helpers, 'cleanLines').mockReturnValue(mockLines)
      jest
        .spyOn(helpers, 'createBranchData')
        .mockImplementation((arr) => mockBranchData.shift())
      const result = await gitManager.getBranches()
      expect(result).toEqual([
        {
          isCurrent: true,
          name: 'main',
          commitHash: 'abc123',
          subject: 'msg',
          authorName: 'author',
          committerDate: 'date'
        },
        {
          isCurrent: false,
          name: 'dev',
          commitHash: 'def456',
          subject: 'msg2',
          authorName: 'author2',
          committerDate: 'date2'
        }
      ])
    })
  })

  describe('deleteBranchs', () => {
    it('should delete branches and return true', async () => {
      jest.spyOn(helpers, 'execAsync').mockResolvedValue({})
      const result = await gitManager.deleteBranchs(['main', 'dev'])
      expect(result).toBe(true)
    })
    it('should return false if execAsync throws', async () => {
      jest.spyOn(helpers, 'execAsync').mockRejectedValue(new Error('fail'))
      const result = await gitManager.deleteBranchs('main')
      expect(result).toBe(false)
    })
  })

  describe('printBranches', () => {
    it('should print formatted branches and call console.log', async () => {
      const branches = [
        {
          isCurrent: true,
          name: 'main',
          commitHash: 'abc',
          subject: 'msg',
          authorName: 'a',
          committerDate: 'd'
        },
        {
          isCurrent: false,
          name: 'dev',
          commitHash: 'def',
          subject: 'msg2',
          authorName: 'b',
          committerDate: 'e'
        }
      ]
      jest.spyOn(gitManager, 'getBranches').mockResolvedValue(branches)
      await gitManager.printBranches()
      await new Promise((r) => setTimeout(r, 100)) // wait for console.log to be called
      expect(console.log).toHaveBeenCalled()
    })
    it('should call exitCli if no branches', async () => {
      jest.spyOn(helpers, 'execAsync').mockResolvedValue({ stdout: '' })
      jest.spyOn(gitManager, 'getBranches').mockResolvedValue([])
      await gitManager.printBranches()
      expect(cli.exitCli).toHaveBeenCalledWith('No branches found.')
    })
  })
})
