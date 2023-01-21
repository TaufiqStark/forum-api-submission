const Comment = require('../Comment');

describe('a Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'abc',
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'test comment',
      date: new Date('2023-01-09'),
      username: 'user-123',
      replies: [],
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create a comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'test comment',
      date: new Date('2023-01-09'),
      username: 'user-123',
      replies: [],
    };

    // Action
    const {
      id, content, date, username, replies,
    } = new Comment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(replies).toEqual(payload.replies);
  });
});
