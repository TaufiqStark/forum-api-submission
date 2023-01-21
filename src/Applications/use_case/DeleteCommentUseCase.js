class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(id, owner) {
    this._validatePayload(id);
    await this._commentRepository.verifyAvailabilityComment(id);
    await this._commentRepository.verifyCommentOwner(id, owner);
    return this._commentRepository.deleteComment(id);
  }

  _validatePayload(id) {
    if (!id) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_ID');
    }
    if (typeof id !== 'string') {
      throw new Error('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteCommentUseCase;
