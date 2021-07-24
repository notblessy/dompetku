exports.up = function (knex) {
  return knex.schema.createTable('budgets', function (table) {
    table.bigIncrements('id');

    table.string('user_id', 255).notNullable();
    table
      .foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    table.bigInteger('currency_id').unsigned();
    table.foreign('currency_id').references('id').inTable('currencies');

    table.string('name', 255).notNullable().index();
    table.integer('amount').defaultTo(0);

    table
      .enu('recurrence', ['ONCE', 'WEEKLY', 'MONTHLY', 'YEARLY'], {
        enumName: 'recurrence',
      })
      .notNullable()
      .defaultTo('ONCE');
    table.timestamps(true, true);
    table.datetime('deleted_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('budgets');
};
