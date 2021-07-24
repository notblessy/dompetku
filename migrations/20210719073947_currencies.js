exports.up = function (knex) {
  return knex.schema.createTable('currencies', function (table) {
    table.bigIncrements('id');
    table.string('name', 255).notNullable().index();
    table.string('code', 255).index();
    table.timestamps(true, true);
    table.datetime('deleted_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('currencies');
};
