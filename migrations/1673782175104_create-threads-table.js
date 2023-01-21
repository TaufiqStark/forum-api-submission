/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    body: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      references: '"users"',
      onDelete: 'CASCADE',
      notNull: true,
    },
    date: {
      type: 'DATE',
      default: '"NOW()"',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('threads');
};
