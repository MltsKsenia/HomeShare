exports.up = async function (knex) {
    // Add new colums to users
    await knex.schema.table('users', (table) => {
        table.string('phone_number', 20).nullable();
        table.string('full_name', 255).nullable();
        table.string('address', 255).nullable();
        table.string('profile_image_url', 255).nullable();
        table.date('date_of_birth').nullable();
    });
};

exports.down = async function (knex) {
    // Delete columns if migration is rolled back
    await knex.schema.table('users', (table) => {
        table.dropColumn('phone_number');
        table.dropColumn('full_name');
        table.dropColumn('address');
        table.dropColumn('profile_image_url');
        table.dropColumn('date_of_birth');
    });
};