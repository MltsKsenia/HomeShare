exports.up = async function (knex) {
    await knex.schema.table('reservations', function (table) {
        table.integer('owner_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    });
};

exports.down = async function (knex) {
    await knex.schema.table('reservations', function (table) {
        table.dropColumn('owner_id');
    });
};