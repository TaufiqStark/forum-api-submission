/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async addLike(commentId, userId, id = 'like-123') {
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3)',
      values: [id, commentId, userId],
    };

    await pool.query(query);
  },

  async getCommentLikesCount(id) {
    const query = {
      text: 'SELECT * FROM likes WHERE "commentId" = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rowCount;
  },
  async cleanTable() {
    await pool.query('DELETE FROM likes WHERE 1=1');
  },
};

module.exports = LikesTableTestHelper;
