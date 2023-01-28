const Comment = require('../../Domains/comments/entities/Comment');
const Thread = require('../../Domains/threads/entities/Thread');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(id) {
    this._validatePayload(id);
    const thread = await this._threadRepository.getThreadById(id);
    const comments = await this._commentRepository.getCommentsByThreadId(id);

    thread.comments = comments.filter((comment) => !comment.commentId)
      .map((comment) => {
        const replies = comments.filter((reply) => reply.commentId === comment.id)
          .map((reply) => new Comment(reply));
        return new Comment({ ...comment, replies });
      });
    return new Thread(thread);
  }

  _validatePayload(id) {
    if (!id) {
      throw new Error('GET_THREAD_USE_CASE.NOT_CONTAIN_ID');
    }
    if (typeof id !== 'string') {
      throw new Error('GET_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThreadUseCase;
