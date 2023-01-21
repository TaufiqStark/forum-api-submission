const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');

describe('/threads endpoint', () => {
  beforeAll(async () => {
    // add user and login before run all test
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

    global.user = user?.data?.addedUser;
    global.token = token?.data;
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted user', async () => {
      // Arrange
      const requestPayload = {
        title: 'abc',
        body: 'test thread',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: { Authorization: `Bearer ${global.token?.accessToken}` },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'abc',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: { Authorization: `Bearer ${global.token?.accessToken}` },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: 'abc',
        body: ['Indonesia'],
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: { Authorization: `Bearer ${global.token?.accessToken}` },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });
  });

  describe('when GET /threads', () => {
    it('should throw 404 if id not found', async () => {
      // Arrange
      const requestId = 'xxx';
      const server = await createServer(container);

      // Action
      const response = await server.inject(`/threads/${requestId}`);

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should get thread object correctly', async () => {
      // Arrange
      const requestId = 'thread-123';
      const server = await createServer(container);
      await ThreadsTableTestHelper.addThread({ id: requestId, owner: global.user.id });

      // Action
      const response = await server.inject(`/threads/${requestId}`);

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
    });
  });
});
