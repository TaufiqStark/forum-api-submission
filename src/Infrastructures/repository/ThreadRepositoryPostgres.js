const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const Comment = require('../../Domains/comments/entities/Comment');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const Thread = require('../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(thread, owner) {
    const id = `thread-${this._idGenerator()}`;
    const { title, body } = thread;
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async verifyAvailabilityThread(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async getThreadById(id) {
    const query = {
      text: `SELECT t.date::timestamptz, t.*, u.username FROM threads t
      LEFT JOIN users u ON u.id = t.owner WHERE t.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    const commentQuery = {
      text: `SELECT c.date::timestamptz, c.*, u.username FROM comments c
      LEFT JOIN users u ON u.id = c.owner WHERE c."threadId" = $1 ORDER BY date`,
      values: [result.rows[0]?.id],
    };
    const comments = await this._pool.query(commentQuery);

    return new Thread({
      ...result.rows[0],
      comments: comments.rows
        .map((c) => new Comment({ ...c, replies: [] })),
    });
  }
}

module.exports = ThreadRepositoryPostgres;
