exports.up = async function (knex) {
  // Сreate a items table
  await knex.schema.createTable('items', function (table) {
    table.increments('id').primary();
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('name', 100).notNullable();
    table.text('description');
    table.string('category', 50);
    table.string('image_url', 255);
    table.jsonb('available_days');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Function for auto update updated_at
  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_items_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // Create a trigger for updated_at before each update
  await knex.raw(`
    CREATE TRIGGER update_items_updated_at
    BEFORE UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_items_timestamp();
  `);
};

exports.down = async function (knex) {
  // Delete trigger and function
  await knex.raw('DROP TRIGGER IF EXISTS update_items_updated_at ON items');
  await knex.raw('DROP FUNCTION IF EXISTS update_items_timestamp');

  // Delete users table
  await knex.schema.dropTableIfExists('items');
};