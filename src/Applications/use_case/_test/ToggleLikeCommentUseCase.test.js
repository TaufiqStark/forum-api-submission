const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ToggleLikeCommentUseCase = require('../ToggleLikeCommentUseCase');

describe('ToggleLikeCommentUseCase', () => {
  it('should orchestrating the add like comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyAvailabilityThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyAvailabilityComment = jest.fn(() => Promise.resolve());
    mockLikeRepository.isLiked = jest.fn(() => Promise.resolve(false));
    mockLikeRepository.addLike = jest.fn(() => Promise.resolve());

    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await toggleLikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.verifyAvailabilityComment)
      .toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.isLiked)
      .toHaveBeenCalledWith(useCasePayload.userId, useCasePayload.commentId);
    expect(mockLikeRepository.addLike)
      .toHaveBeenCalledWith(useCasePayload.userId, useCasePayload.commentId);
  });

  it('should orchestrating the delete like comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyAvailabilityThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyAvailabilityComment = jest.fn(() => Promise.resolve());
    mockLikeRepository.isLiked = jest.fn(() => Promise.resolve(true));
    mockLikeRepository.deleteLike = jest.fn(() => Promise.resolve());

    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await toggleLikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.verifyAvailabilityComment)
      .toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.isLiked)
      .toHaveBeenCalledWith(useCasePayload.userId, useCasePayload.commentId);
    expect(mockLikeRepository.deleteLike)
      .toHaveBeenCalledWith(useCasePayload.userId, useCasePayload.commentId);
  });
});
