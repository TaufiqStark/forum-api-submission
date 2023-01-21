/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      references: '"users"',
      onDelete: 'CASCADE',
      notNull: true,
    },
    threadId: {
      type: 'VARCHAR(50)',
      references: '"threads"',
      onDelete: 'CASCADE',
      noNull: true,
    },
    commentId: {
      type: 'VARCHAR(50)',
      references: '"comments"',
      onDelete: 'CASCADE',
    },
    date: {
      type: 'TIMESTAMPTZ',
      default: pgm.func('now()'),
    },
    isDelete: {
      type: 'BOOLEAN',
      default: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
