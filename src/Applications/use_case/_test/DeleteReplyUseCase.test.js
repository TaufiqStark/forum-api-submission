const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should throw error if use case payload not contain id', async () => {
    // Arrange
    const commentId = null;
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action & Assert
    await expect(deleteReplyUseCase.execute(commentId, 'user-123'))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.NOT_CONTAIN_ID');
  });

  it('should throw error if reply id not string', async () => {
    // Arrange
    const commentId = 123;
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action & Assert
    await expect(deleteReplyUseCase.execute(commentId, 'user-123'))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const commentId = 'comment-123';

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.verifyAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteReplyUseCase.execute(commentId, 'user-123');

    // Assert
    expect(mockCommentRepository.verifyAvailabilityComment)
      .toHaveBeenCalledWith(commentId);
    expect(mockCommentRepository.verifyCommentOwner)
      .toBeCalledWith(commentId, 'user-123');
    expect(mockCommentRepository.deleteComment)
      .toHaveBeenCalledWith(commentId);
  });
});
