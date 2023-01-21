const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment({
    content, threadId, owner, commentId = null,
  }) {
    const id = `comment-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, owner, threadId, commentId],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT content FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('tidak memiliki akses pada comment');
    }
  }

  async verifyAvailabilityComment(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async deleteComment(id, deleteMessage = '**komentar telah dihapus**') {
    const query = {
      text: 'UPDATE comments SET "isDelete" = $1, content = $2 WHERE id = $3',
      values: [true, deleteMessage, id],
    };

    await this._pool.query(query);
  }
}
module.exports = CommentRepositoryPostgres;
