import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableValues1746226609853 implements MigrationInterface {
    name = 'NullableValues1746226609853'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "terms" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "history_log" DROP COLUMN "entity"`);
        await queryRunner.query(`ALTER TABLE "history_log" ADD "entity" character varying NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."history_log_entity_action_enum_old" AS ENUM('CREATE_USER', 'CREATE_TERM', 'ACCEPT_TERM', 'DELETE_USER')`);
        await queryRunner.query(`ALTER TABLE "history_log" ALTER COLUMN "action" TYPE "public"."history_log_entity_action_enum_old" USING "action"::"text"::"public"."history_log_entity_action_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."history_log_action_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."history_log_entity_action_enum_old" RENAME TO "history_log_entity_action_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "terms" ADD "deleted_at" TIMESTAMP`);
    }

}
