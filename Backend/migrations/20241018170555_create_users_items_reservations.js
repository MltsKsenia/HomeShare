exports.up = async function (knex) {
  // Сreate a reservations table
  await knex.schema.createTable('reservations', function (table) {
    table.increments('id').primary();
    table.integer('item_id').notNullable().references('id').inTable('items').onDelete('CASCADE');
    // Reservation Creator
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.string('status', 50).defaultTo('pending');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Function for auto update updated_at
  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_reservations_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // Create a trigger for updated_at before each update
  await knex.raw(`
    CREATE TRIGGER update_reservations_updated_at
    BEFORE UPDATE ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_reservations_timestamp();
  `);
};

exports.down = async function (knex) {
  // Delete trigger and function
  await knex.raw('DROP TRIGGER IF EXISTS update_reservations_updated_at ON reservations');
  await knex.raw('DROP FUNCTION IF EXISTS update_reservations_timestamp');

  // Delete users table
  await knex.schema.dropTableIfExists('reservations');
};