const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const commentId = null;
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(commentId, 'user-123'))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_ID');
  });

  it('should throw error if comment id not string', async () => {
    // Arrange
    const commentId = 123;
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(commentId, 'user-123'))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const commentId = 'comment-123';

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.verifyAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(commentId, 'user-123');

    // Assert
    expect(mockCommentRepository.verifyAvailabilityComment)
      .toHaveBeenCalledWith(commentId);
    expect(mockCommentRepository.deleteComment)
      .toHaveBeenCalledWith(commentId);
  });
});
