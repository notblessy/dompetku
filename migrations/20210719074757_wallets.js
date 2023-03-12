exports.up = function (knex) {
  return knex.schema.createTable("wallets", function (table) {
    table.bigIncrements("id");

    table.string("user_id");
    table.foreign("user_id").references("id").inTable("users");

    table.string("name", 255).notNullable().index();
    table.integer("initial_balance").defaultTo(0);
    table.timestamps(true, true);
    table.datetime("deleted_at");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("wallets");
};
