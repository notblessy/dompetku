exports.up = function (knex) {
  return knex.schema.createTable('sub_categories', function (table) {
    table.bigIncrements('id');

    table.integer('category_id').unsigned();
    table.foreign('category_id').references('id').inTable('categories');

    table.string('name', 255).notNullable().index();
    table.text('picture');

    table.timestamps(true, true);
    table.datetime('deleted_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('sub_categories');
};
