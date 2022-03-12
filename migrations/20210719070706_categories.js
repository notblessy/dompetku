exports.up = function (knex) {
  return knex.schema.createTable('categories', function (table) {
    table.bigIncrements('id');

    table.string('user_id', 255);
    table.foreign('user_id').references('id').inTable('users');

    table.string('name', 255).notNullable().index();
    table
      .enu('type', ['EXPENSES', 'INCOME'], { enumName: 'role' })
      .notNullable()
      .defaultTo('EXPENSES');
    table.text('icon');
    table.string('slug', 255).index();
    table.timestamps(true, true);
    table.datetime('deleted_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('categories');
};
