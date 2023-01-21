const Thread = require('../Thread');

describe('a Thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
    };

    // Action & Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: {},
      body: 'test thread',
      date: new Date('2023-01-09'),
      username: 'user-123',
      comments: [],
    };

    // Action & Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create a thread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'abc',
      body: 'test thread',
      date: new Date('2023-01-09'),
      username: 'user-123',
      comments: [],
    };

    // Action
    const {
      id, title, body, date, username, comments,
    } = new Thread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(comments).toEqual(payload.comments);
  });
});
