const Thread = require('../../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should throw if not contain id', async () => {
    // Arrange
    const useCaseId = null;
    const getGetThreadUseCase = new GetThreadUseCase({});

    // Action & Assert
    await expect(getGetThreadUseCase.execute(useCaseId))
      .rejects
      .toThrowError('GET_THREAD_USE_CASE.NOT_CONTAIN_ID');
  });

  it('should throw error if id not string', async () => {
    // Arrange
    const useCaseId = ['id'];
    const getThreadUseCase = new GetThreadUseCase({});

    // Action & Assert
    await expect(getThreadUseCase.execute(useCaseId))
      .rejects
      .toThrowError('GET_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCaseId = 'thread-123';
    const expectedThread = new Thread({
      id: 'thread-123',
      title: 'test',
      body: 'test thread',
      date: new Date('2023-01-09'),
      username: 'user-123',
      comments: [],
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(new Thread({
        id: 'thread-123',
        title: 'test',
        body: 'test thread',
        date: new Date('2023-01-09'),
        username: 'user-123',
        comments: [],
      })));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const getThread = await getThreadUseCase.execute(useCaseId);

    // Assert
    expect(getThread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseId);
  });
});
