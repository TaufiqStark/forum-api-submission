class ToggleLikeCommentUseCase {
  constructor({ likeRepository, threadRepository, commentRepository }) {
    this._likeRepository = likeRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    const { userId, threadId, commentId } = payload;
    await this._threadRepository.verifyAvailabilityThread(threadId);
    await this._commentRepository.verifyAvailabilityComment(commentId);
    const isLiked = await this._likeRepository.isLiked(userId, commentId);

    if (isLiked) {
      await this._likeRepository.deleteLike(userId, commentId);
    } else {
      await this._likeRepository.addLike(userId, commentId);
    }
  }
}

module.exports = ToggleLikeCommentUseCase;
