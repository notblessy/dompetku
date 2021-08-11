exports.up = function (knex) {
  return knex.schema.createTable('categories', function (table) {
    table.increments('id');
    table.string('name', 255).notNullable().index();
    table.string('slug', 255).index();
    table.text('picture');
    table.timestamps(true, true);
    table.datetime('deleted_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('categories');
};
