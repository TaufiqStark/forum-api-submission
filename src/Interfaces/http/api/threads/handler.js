const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler({ payload, auth }, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: owner } = auth.credentials;

    const addedThread = await addThreadUseCase
      .execute(payload, owner);

    const response = h.response({
      status: 'success',
      data: { addedThread },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler({ params: { id } }) {
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);

    const thread = await getThreadUseCase.execute(id);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }
}

module.exports = ThreadsHandler;
