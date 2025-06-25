import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('User')
    .addColumn('google', 'json', (col) => col.defaultTo('{}'))
    .execute()
}
