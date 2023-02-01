const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(userId, commentId) {
    const id = `like-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3)',
      values: [id, userId, commentId],
    };

    await this._pool.query(query);
  }

  async deleteLike(userId, commentId) {
    const query = {
      text: 'DELETE FROM likes WHERE "userId" = $1 AND "commentId" = $2',
      values: [userId, commentId],
    };

    await this._pool.query(query);
  }

  async isLiked(userId, commentId) {
    const query = {
      text: 'SELECT id FROM likes WHERE "userId" = $1 AND "commentId" = $2',
      values: [userId, commentId],
    };

    const result = await this._pool.query(query);

    return Boolean(result.rowCount);
  }

  async getCommentLikesCount(commentId) {
    const query = {
      text: 'SELECT COUNT(*)::int FROM likes WHERE "commentId" = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows[0].count;
  }
}

module.exports = LikeRepositoryPostgres;
