const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads/{threadsId}/comments endpoints', () => {
  beforeAll(async () => {
    // add user, login and add thread before run all test
    const server = await createServer(container);

    const userPayload = {
      username: 'test',
      password: 'secret',
      fullname: 'Test Indonesia',
    };

    const { result: user } = await server.inject({
      method: 'POST',
      url: '/users',
      payload: userPayload,
    });

    const { result: token } = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: userPayload.username,
        password: userPayload.password,
      },
    });

    const { result: thread } = await server.inject({
      method: 'POST',
      url: '/threads',
      headers: { Authorization: `Bearer ${token?.data?.accessToken}` },
      payload: {
        title: 'test',
        body: 'test thread',
      },
    });

    global.user = user?.data?.addedUser;
    global.token = token?.data;
    global.thread = thread?.data.addedThread;
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 200 and persist comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'abc',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${global.thread.id}/comments`,
        headers: { Authorization: `Bearer ${global.token?.accessToken}` },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'abc',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments',
        headers: { Authorization: `Bearer ${global.token?.accessToken}` },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200', async () => {
      // Arrange
      const requestPayload = {
        content: 'abc',
      };
      const server = await createServer(container);
      const { result: comment } = await server.inject({
        method: 'POST',
        url: `/threads/${global.thread.id}/comments`,
        headers: { Authorization: `Bearer ${global.token?.accessToken}` },
        payload: requestPayload,
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${global.thread.id}/comments/${comment?.data?.addedComment?.id}`,
        headers: { Authorization: `Bearer ${global.token?.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 404 when comment not found', async () => {
      // Arrange
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${global.thread.id}/comments/xxx`,
        headers: { Authorization: `Bearer ${global.token?.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ditemukan');
    });
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 200 and persist comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'abc',
      };
      const server = await createServer(container);

      const { result: comment } = await server.inject({
        method: 'POST',
        url: `/threads/${global.thread.id}/comments`,
        headers: { Authorization: `Bearer ${global.token?.accessToken}` },
        payload: requestPayload,
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${global.thread?.id}/comments/${comment?.data?.addedComment?.id}/replies`,
        headers: { Authorization: `Bearer ${global.token?.accessToken}` },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'abc',
      };
      const server = await createServer(container);
      const { result: comment } = await server.inject({
        method: 'POST',
        url: `/threads/${global.thread?.id}/comments`,
        headers: { Authorization: `Bearer ${global.token?.accessToken}` },
        payload: requestPayload,
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/xxx/comments/${comment?.data?.addedComment?.id}/replies`,
        headers: { Authorization: `Bearer ${global.token?.accessToken}` },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 when comment not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'abc',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${global.thread?.id}/comments/xxx/replies`,
        headers: { Authorization: `Bearer ${global.token?.accessToken}` },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ditemukan');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200', async () => {
      // Arrange
      const requestPayload = {
        content: 'abc',
      };
      const server = await createServer(container);
      const { result: comment } = await server.inject({
        method: 'POST',
        url: `/threads/${global.thread.id}/comments`,
        headers: { Authorization: `Bearer ${global.token?.accessToken}` },
        payload: requestPayload,
      });
      const { result: reply } = await server.inject({
        method: 'POST',
        url: `/threads/${global.thread?.id}/comments/${comment?.data?.addedComment?.id}/replies`,
        headers: { Authorization: `Bearer ${global.token?.accessToken}` },
        payload: requestPayload,
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${global.thread.id}/comments/${comment?.data?.addedComment?.id}/replies/${reply?.data?.addedReply?.id}`,
        headers: { Authorization: `Bearer ${global.token?.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 404 when comment not found', async () => {
      // Arrange
      const server = await createServer(container);

      const { result: comment } = await server.inject({
        method: 'POST',
        url: `/threads/${global.thread.id}/comments`,
        headers: { Authorization: `Bearer ${global.token?.accessToken}` },
        payload: { content: 'abc' },
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${global.thread.id}/comments/${comment?.data.addedComment?.id}/replies/xxx`,
        headers: { Authorization: `Bearer ${global.token?.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ditemukan');
    });
  });
});
