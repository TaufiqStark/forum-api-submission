const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const Thread = require('../../../Domains/threads/entities/Thread');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const Comment = require('../../../Domains/comments/entities/Comment');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread', () => {
    it('should persist add thread and return addedThread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'test',
        body: 'test thread',
      });
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const fakeIdGenerator = () => '123'; // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(newThread, 'user-123');

      // Assert
      const thread = await ThreadsTableTestHelper.getThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return addedThread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'test',
        body: 'test thread',
      });
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const fakeIdGenerator = () => '123'; // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread, 'user-123');

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'test',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyAvailabilityThread', () => {
    it('should throw NotFoundError if thread not available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
      const threadId = 'thread-123';

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailabilityThread(threadId))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError if thread available', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const threadPayload = {
        id: 'thread-123',
        owner: 'user-123',
      };
      await UsersTableTestHelper.addUser({ id: threadPayload.owner });
      await ThreadsTableTestHelper.addThread({
        id: threadPayload.id, owner: threadPayload.owner,
      });

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailabilityThread(threadPayload.id))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('getThreadById', () => {
    it('should throw NotFoundError when thread not found', () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      expect(threadRepositoryPostgres.getThreadById('thread-000'))
        .rejects.toThrow(NotFoundError);
    });

    it('should return addedThread object correctly when thread is found', async () => {
      // Arrange
      const expectedComment = new Thread({
        id: 'thread-123',
        title: 'test',
        body: 'test thread',
        date: new Date('2023-01-17T17:00:00.000Z'),
        username: 'test',
        comments: [],
      });
      const threadPayload = {
        id: 'thread-123',
        owner: 'user-123',
      };

      await UsersTableTestHelper.addUser({ id: threadPayload.owner });
      await ThreadsTableTestHelper.addThread({
        id: threadPayload.id, owner: threadPayload.owner,
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const addedThread = await threadRepositoryPostgres.getThreadById(threadPayload.id);

      // Assert
      expect(addedThread).toStrictEqual(expectedComment);
    });

    it('should return addedThread object correctly when thread is found and has comment', async () => {
      // Arrange
      const threadPayload = {
        id: 'thread-123',
        owner: 'user-123',
      };
      const expectedThread = new Thread({
        id: 'thread-123',
        title: 'test',
        body: 'test thread',
        date: new Date('2023-01-17T17:00:00.000Z'),
        username: 'test',
        comments: [new Comment({
          id: 'comment-123',
          content: 'test comment',
          date: new Date('2023-01-17T17:00:00.000Z'),
          username: 'test',
          replies: [],
        })],
      });

      await UsersTableTestHelper.addUser({ id: threadPayload.owner });
      await ThreadsTableTestHelper.addThread({
        id: threadPayload.id, owner: threadPayload.owner,
      });
      await CommentsTableTestHelper.addComment({
        threadId: threadPayload.id, owner: threadPayload.owner,
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const addedThread = await threadRepositoryPostgres.getThreadById(threadPayload.id);

      // Assert
      expect(addedThread).toStrictEqual(expectedThread);
      expect(addedThread.comments).toStrictEqual(expectedThread.comments);
    });
  });
});
