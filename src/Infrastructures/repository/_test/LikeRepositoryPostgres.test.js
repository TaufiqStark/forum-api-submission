const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike', () => {
    it('should persist add like correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });
      const fakeIdGenerator = () => '123'; // stub
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.addLike('user-123', 'comment-123');

      // Assert
      const like = await LikesTableTestHelper.getCommentLikesCount('comment-123');
      expect(like).toEqual(1);
    });
  });

  describe('deleteLike', () => {
    it('should persist delete like correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });
      await LikesTableTestHelper.addLike('user-123', 'comment-123');
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      await likeRepositoryPostgres.deleteLike('user-123', 'comment-123');

      // Assert
      const like = await LikesTableTestHelper.getCommentLikesCount('comment-123');
      expect(like).toEqual(0);
    });
  });

  describe('isLiked', () => {
    it('should persist check is liked correctly and return true', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });
      await LikesTableTestHelper.addLike('user-123', 'comment-123');
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const like = await likeRepositoryPostgres.isLiked('user-123', 'comment-123');

      // Assert
      expect(like).toBeTruthy();
    });

    it('should persist check is liked correctly and return false', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const like = await likeRepositoryPostgres.isLiked('user-123', 'comment-123');

      // Assert
      expect(like).toBeFalsy();
    });
  });

  describe('getCommentLikesCount', () => {
    it('should persist getCommentLikesCount correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });
      await LikesTableTestHelper.addLike('user-123', 'comment-123');
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const like = await likeRepositoryPostgres.getCommentLikesCount('comment-123');

      // Assert
      expect(like).toEqual(1);
    });
  });
});
