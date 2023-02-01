class Comment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, content, date, username, replies, isDelete, commentId, likeCount,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = content;
    this.likeCount = likeCount;
    this.replies = replies;
    if (isDelete) {
      this.content = commentId ? '**balasan telah dihapus**' : '**komentar telah dihapus**';
    }
  }

  _verifyPayload({
    id, content, date, username,
  }) {
    if (!id || !content || !date || !username) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof date !== 'object' || typeof username !== 'string') {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
