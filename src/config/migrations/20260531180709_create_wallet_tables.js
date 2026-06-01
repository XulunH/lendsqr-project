/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('users',(table)=>{
    table.increments('id').primary();
    table.string('email').notNullable().unique();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('status').notNullable().defaultTo('ACTIVE'); // For soft-deletes
    table.timestamps(true,true);
  });

  await knex.schema.createTable('wallets',(table)=>{
    table.increments('id').primary();
    table
       .integer('user_id')
       .unsigned()
       .notNullable()
       .unique()
       .references('id')
       .inTable('users')
       .onDelete('RESTRICT'); //record keeping
    table.decimal('balance',15,4).notNullable().defaultTo(0.0000); //common precision in fintech app
    table.string('currency').notNullable().defaultTo('USD');
    table.timestamps(true,true);

  });

  await knex.schema.createTable('transactions',(table)=>{
    table.increments('id').primary();
    table.string('reference').notNullable().unique();
    table
       .integer('sender_wallet_id')
       .unsigned()
       .nullable()
       .references('id')
       .inTable('wallets')
       .onDelete('RESTRICT'); //strict record keeping for legal compliance
    table
       .integer('receiver_wallet_id')
       .unsigned()
       .nullable()
       .references('id')
       .inTable('wallets')
       .onDelete('RESTRICT');
    table.decimal('amount', 15, 4).notNullable();
    table.string('currency').notNullable().defaultTo('USD');
    table.enum('type', ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER']).notNullable();
    table.enum('status', ['PENDING', 'SUCCESS', 'FAILED']).notNullable().defaultTo('PENDING');
    table.string('description').nullable();
    table.timestamps(true, true);
});

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists('transactions');
    await knex.schema.dropTableIfExists('wallets');
    await knex.schema.dropTableIfExists('users');
};
