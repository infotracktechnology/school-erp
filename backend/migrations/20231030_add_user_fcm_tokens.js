// Migration to create the user_fcm_tokens table
module.exports.up = async function (sutando) {
  const hasTable = await sutando.schema.hasTable('user_fcm_tokens');
  if (!hasTable) {
    await sutando.schema.createTable('user_fcm_tokens', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.string('token', 255).notNullable();
      table.timestamp('created_at').defaultTo(sutando.raw('CURRENT_TIMESTAMP'));
      table.timestamp('updated_at').defaultTo(sutando.raw('CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP'));
      table.foreign('user_id').references('users.id').onDelete('CASCADE');
      // Uncomment for single-token per user
      // table.unique(['user_id']);
    });
    console.log('✔ Created user_fcm_tokens table');
  }
};

module.exports.down = async function (sutando) {
  const hasTable = await sutando.schema.hasTable('user_fcm_tokens');
  if (hasTable) {
    await sutando.schema.dropTable('user_fcm_tokens');
    console.log('✔ Dropped user_fcm_tokens table');
  }
};
