exports.up = async function (knex) {
  // Сreate a users table
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('username', 100).notNullable();
    table.string('email', 100).notNullable().unique();
    table.string('password', 255).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Function for auto update updated_at
  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // Create a trigger for updated_at before each update
  await knex.raw(`
    CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
  `);
};

exports.down = async function (knex) {
  // Delete trigger and function
  await knex.raw(`DROP TRIGGER IF EXISTS update_users_updated_at ON users`);
  await knex.raw(`DROP FUNCTION IF EXISTS update_timestamp`);

  // Delete users table
  await knex.schema.dropTableIfExists('users');
};