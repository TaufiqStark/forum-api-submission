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
      likeCount: 1,
      replies: [],
    };

    // Action
    const {
      id, content, date, username, likeCount, replies,
    } = new Comment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(likeCount).toEqual(payload.likeCount);
    expect(replies).toEqual(payload.replies);
  });

  it('should create a comment object correctly but not have replies', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'test comment',
      date: new Date('2023-01-09'),
      username: 'user-123',
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
    expect(replies).not.toBeDefined();
  });

  it('should create a comment object correctly but is deleted', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'test comment',
      date: new Date('2023-01-09'),
      username: 'user-123',
      isDelete: true,
    };

    // Action
    const {
      id, content, date, username,
    } = new Comment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual('**komentar telah dihapus**');
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });

  it('should create a comment object as reply correctly but is deleted', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'test comment',
      date: new Date('2023-01-09'),
      username: 'user-123',
      commentId: 'comment-321',
      isDelete: true,
    };

    // Action
    const {
      id, content, date, username,
    } = new Comment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual('**balasan telah dihapus**');
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});
