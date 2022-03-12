exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.string('id', 255).notNullable().primary().index();

    table.string('email', 150).index();
    table.string('name', 150);
    table.string('password', 150);
    table.text('picture');
    table
      .enu('role', ['ADMIN', 'USER'], { enumName: 'role' })
      .notNullable()
      .defaultTo('USER');
    table.timestamps(true, true);
    table.datetime('deleted_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
