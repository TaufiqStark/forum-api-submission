class GetThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(id) {
    this._validatePayload(id);
    return this._threadRepository.getThreadById(id);
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
