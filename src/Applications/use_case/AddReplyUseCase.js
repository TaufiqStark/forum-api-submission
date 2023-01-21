const NewComment = require('../../Domains/comments/entities/NewComment');

class AddReplyUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    const newReply = new NewComment(payload);
    await this._threadRepository.verifyAvailabilityThread(newReply.threadId);
    await this._commentRepository.verifyAvailabilityComment(newReply?.commentId);
    return this._commentRepository.addComment(newReply);
  }
}

module.exports = AddReplyUseCase;
