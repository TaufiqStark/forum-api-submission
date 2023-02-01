exports.up = (pgm) => {
  pgm.createTable('likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true,
    },
    userId: {
      type: 'VARCHAR(50)',
      references: '"users"',
      onDelete: 'CASCADE',
      notNull: true,
    },
    commentId: {
      type: 'VARCHAR(50)',
      references: '"comments"',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('likes');
};
