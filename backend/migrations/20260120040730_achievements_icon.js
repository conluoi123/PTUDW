/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.createTable('achievements_icon', function(table) {
      table.increments('id').primary();
      

      table.string('icon_url', 1000).notNullable(); 
      

      table.integer('achievement_id').unsigned().notNullable();
      table.foreign('achievement_id')
        .references('id')
        .inTable('achievements')
        .onDelete('CASCADE');
  
      table.timestamps(true, true);
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export async function down(knex) {
    return knex.schema.dropTable('achievements_icon');
  };