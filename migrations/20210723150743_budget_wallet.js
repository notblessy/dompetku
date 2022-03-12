exports.up = function (knex) {
  return knex.schema.createTable('budget_wallets', function (table) {
    table.bigIncrements('id');

    table.bigInteger('budget_id').unsigned();
    table.foreign('budget_id').references('id').inTable('budgets');

    table.bigInteger('wallet_id').unsigned();
    table.foreign('wallet_id').references('id').inTable('wallets');

    table.timestamps(true, true);
    table.datetime('deleted_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('budget_wallets');
};
