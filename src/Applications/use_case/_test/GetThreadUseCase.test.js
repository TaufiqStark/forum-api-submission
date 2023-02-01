const CommentRepository = require('../../../Domains/comments/CommentRepository');
const Comment = require('../../../Domains/comments/entities/Comment');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
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
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(new Thread({
      id: 'thread-123',
      title: 'test',
      body: 'test thread',
      date: new Date('2023-01-09'),
      username: 'user-123',
    })));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve([]));
    mockLikeRepository.getCommentsLikesCount = jest.fn(() => []);

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const getThread = await getThreadUseCase.execute(useCaseId);

    // Assert
    expect(getThread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCaseId);
  });

  it('should orchestrating the get thread with comments correctly', async () => {
    // Arrange
    const useCaseId = 'thread-123';
    const expectedThread = new Thread({
      id: 'thread-123',
      title: 'test',
      body: 'test thread',
      date: new Date('2023-01-15T17:00:00.000Z'),
      username: 'user-123',
      comments: [new Comment({
        id: 'comment-123',
        content: 'test comment',
        date: new Date('2023-01-17T17:00:00.000Z'),
        username: 'user-123',
        likeCount: 1,
        replies: [],
      })],
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(new Thread({
      id: 'thread-123',
      title: 'test',
      body: 'test thread',
      date: new Date('2023-01-15T17:00:00.000Z'),
      username: 'user-123',
    })));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve([new Comment({
      id: 'comment-123',
      content: 'test comment',
      date: new Date('2023-01-17T17:00:00.000Z'),
      username: 'user-123',
      replies: [],
    })]));
    mockLikeRepository.getCommentsLikesCount = jest.fn(() => [{
      commentId: 'comment-123',
      count: 1,
    }]);

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const getThread = await getThreadUseCase.execute(useCaseId);

    // Assert
    expect(getThread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCaseId);
  });

  it('should orchestrating the get thread with comments and replies correctly', async () => {
    // Arrange
    const useCaseId = 'thread-123';
    const expectedThread = new Thread({
      id: 'thread-123',
      title: 'test',
      body: 'test thread',
      date: new Date('2023-01-15T17:00:00.000Z'),
      username: 'user-123',
      comments: [new Comment({
        id: 'comment-123',
        content: 'test comment',
        date: new Date('2023-01-17T17:00:00.000Z'),
        username: 'user-123',
        likeCount: 1,
        replies: [
          new Comment({
            id: 'comment-321',
            content: 'test comment',
            date: new Date('2023-01-19T17:00:00.000Z'),
            username: 'user-123',
            commentId: 'comment-123',
          }),
        ],
      })],
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(new Thread({
      id: 'thread-123',
      title: 'test',
      body: 'test thread',
      date: new Date('2023-01-15T17:00:00.000Z'),
      username: 'user-123',
    })));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve([
      {
        id: 'comment-123',
        content: 'test comment',
        date: new Date('2023-01-17T17:00:00.000Z'),
        username: 'user-123',
      },
      {
        id: 'comment-321',
        content: 'test comment',
        date: new Date('2023-01-19T17:00:00.000Z'),
        username: 'user-123',
        commentId: 'comment-123',
      },
    ]));

    mockLikeRepository.getCommentsLikesCount = jest.fn(() => [{
      commentId: 'comment-123',
      count: 1,
    }]);

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const getThread = await getThreadUseCase.execute(useCaseId);

    // Assert
    expect(getThread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCaseId);
    expect(mockLikeRepository.getCommentsLikesCount).toBeCalledWith(['comment-123']);
  });

  it('should orchestrating the get thread with deleted comments correctly', async () => {
    // Arrange
    const useCaseId = 'thread-123';
    const expectedThread = new Thread({
      id: 'thread-123',
      title: 'test',
      body: 'test thread',
      date: new Date('2023-01-15T17:00:00.000Z'),
      username: 'user-123',
      comments: [new Comment({
        id: 'comment-123',
        content: '**komentar telah dihapus**',
        date: new Date('2023-01-17T17:00:00.000Z'),
        username: 'user-123',
        likeCount: 1,
        replies: [],
      })],
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(new Thread({
      id: 'thread-123',
      title: 'test',
      body: 'test thread',
      date: new Date('2023-01-15T17:00:00.000Z'),
      username: 'user-123',
    })));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve([{
      id: 'comment-123',
      content: 'test comment',
      date: new Date('2023-01-17T17:00:00.000Z'),
      username: 'user-123',
      isDelete: true,
    }]));

    mockLikeRepository.getCommentsLikesCount = jest.fn(() => [{
      commentId: 'comment-123',
      count: 1,
    }]);

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const getThread = await getThreadUseCase.execute(useCaseId);

    // Assert
    expect(getThread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCaseId);
    expect(mockLikeRepository.getCommentsLikesCount).toBeCalledWith(['comment-123']);
  });
});
