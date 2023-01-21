const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    const newComment = new NewComment(payload);
    await this._threadRepository.verifyAvailabilityThread(newComment.threadId);
    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
