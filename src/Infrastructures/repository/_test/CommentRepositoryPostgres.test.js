const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment', () => {
    it('should persist add comment and return addedComment correctly', async () => {
      // Arrange
      const newComment = 'comment';
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment({
        content: newComment,
        threadId: 'thread-123',
        owner: 'user-123',
      });

      // Assert
      const comment = await CommentsTableTestHelper.getCommentById('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return addedComment correctly', async () => {
      // Arrange
      const newComment = 'comment';
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment({
        content: newComment,
        threadId: 'thread-123',
        owner: 'user-123',
      });

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'comment',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyCommentOwner', () => {
    it('should throw AuthorizationError', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const useCasePayload = {
        id: 'comment-123',
        content: 'comment',
        threadId: 'thread-123',
        owner: 'user-123',
      };
      await UsersTableTestHelper.addUser({ id: useCasePayload.owner });
      await ThreadsTableTestHelper.addThread({
        id: useCasePayload.threadId, owner: useCasePayload.owner,
      });
      await CommentsTableTestHelper.addComment(useCasePayload);

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(useCasePayload.id, 'user-321'))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const useCasePayload = {
        id: 'comment-123',
        content: 'comment',
        threadId: 'thread-123',
        owner: 'user-123',
      };
      await UsersTableTestHelper.addUser({ id: useCasePayload.owner });
      await ThreadsTableTestHelper.addThread({
        id: useCasePayload.threadId, owner: useCasePayload.owner,
      });
      await CommentsTableTestHelper.addComment(useCasePayload);

      // Action & Assert
      await expect(commentRepositoryPostgres
        .verifyCommentOwner(useCasePayload.id, useCasePayload.owner))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('verifyAvailabilityComment', () => {
    it('should throw NotFoundError if comment not available', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool);
      const commentId = 'comment-123';

      // Action & Assert
      await expect(commentRepository.verifyAvailabilityComment(commentId))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError if comment available', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const useCasePayload = {
        id: 'comment-123',
        content: 'comment',
        threadId: 'thread-123',
        owner: 'user-123',
      };
      await UsersTableTestHelper.addUser({ id: useCasePayload.owner });
      await ThreadsTableTestHelper.addThread({
        id: useCasePayload.threadId, owner: useCasePayload.owner,
      });
      await CommentsTableTestHelper.addComment(useCasePayload);

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailabilityComment(useCasePayload.id))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('deleteComment', () => {
    it('should set isDelete to true', async () => {
      // Arrange
      const useCasePayload = {
        id: 'comment-123',
        content: 'comment',
        threadId: 'thread-123',
        owner: 'user-123',
      };
      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({ id: useCasePayload.owner });
      await ThreadsTableTestHelper.addThread({
        id: useCasePayload.threadId, owner: useCasePayload.owner,
      });
      await CommentsTableTestHelper.addComment(useCasePayload);

      // Action
      await commentRepositoryPostgres.deleteComment(useCasePayload.id);

      // Assert
      const comment = await CommentsTableTestHelper.getCommentById(useCasePayload.id);

      expect(comment[0]).toBeDefined();
      expect(comment[0].isDelete).toBeTruthy();
    });
  });
});
