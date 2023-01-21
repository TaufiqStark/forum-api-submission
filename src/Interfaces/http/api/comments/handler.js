const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postCommentHandler({ payload, params, auth }, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);

    const { threadId } = params;
    const { id: owner } = auth.credentials;

    const addedComment = await addCommentUseCase.execute({ ...payload, threadId, owner });

    const response = h.response({
      status: 'success',
      data: { addedComment },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler({ params, auth }) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);

    const { commentId } = params;
    const { id: owner } = auth.credentials;

    await deleteCommentUseCase.execute(commentId, owner);

    return { status: 'success' };
  }

  async postReplyHandler({ payload, params, auth }, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);

    const { threadId, commentId } = params;
    const { id: owner } = auth.credentials;

    const addedReply = await addReplyUseCase.execute({
      ...payload, threadId, commentId, owner,
    });

    const response = h.response({
      status: 'success',
      data: { addedReply },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler({ params, auth }) {
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);

    const { replyId } = params;
    const { id: owner } = auth.credentials;

    await deleteReplyUseCase.execute(replyId, owner);

    return { status: 'success' };
  }
}

module.exports = CommentsHandler;
