exports.up = function (knex) {
  return knex.schema.createTable('budget_sub_categories', function (table) {
    table.bigIncrements('id');

    table.bigInteger('budget_id').unsigned();
    table.foreign('budget_id').references('id').inTable('budgets');

    table.bigInteger('sub_category_id').unsigned();
    table.foreign('sub_category_id').references('id').inTable('sub_categories');

    table.timestamps(true, true);
    table.datetime('deleted_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('budget_sub_categories');
};
