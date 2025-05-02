import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEnumHistoryEntity1746202667876 implements MigrationInterface {
    name = 'AddEnumHistoryEntity1746202667876'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."history_log_action_enum" AS ENUM('CREATE_USER', 'CREATE_TERM', 'ACCEPT_TERM', 'DELETE_USER')`);
        await queryRunner.query(`CREATE TYPE "public"."history_log_entity_enum" AS ENUM('User', 'Term')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "history_log"`);
        await queryRunner.query(`DROP TYPE "public"."history_log_entity_enum"`);
        await queryRunner.query(`DROP TYPE "public"."history_log_action_enum"`);
    }

}
