const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
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
}

module.exports = CommentsHandler;
