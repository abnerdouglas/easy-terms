import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHistoryLogs1746111483394 implements MigrationInterface {
    name = 'CreateHistoryLogs1746111483394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_term_acceptances" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "acceptedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "termId" uuid NOT NULL, CONSTRAINT "PK_c62cf3c33c6ef21a4f688fed1bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."history_log_entity_action_enum" AS ENUM('CREATE_USER', 'CREATE_TERM', 'ACCEPT_TERM', 'DELETE_USER')`);
        await queryRunner.query(`CREATE TABLE "history_log_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "action" "public"."history_log_entity_action_enum" NOT NULL, "entity" character varying NOT NULL, "entityId" uuid NOT NULL, "data" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5262e5381b27aabce9ee1cb5739" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "terms" ADD "version" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "terms" ADD "is_active" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "user_term_acceptances" ADD CONSTRAINT "FK_e63c299588360393fb846f66e2b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_term_acceptances" ADD CONSTRAINT "FK_e1c7ac790b4c64474a8c2a14a30" FOREIGN KEY ("termId") REFERENCES "terms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_term_acceptances" DROP CONSTRAINT "FK_e1c7ac790b4c64474a8c2a14a30"`);
        await queryRunner.query(`ALTER TABLE "user_term_acceptances" DROP CONSTRAINT "FK_e63c299588360393fb846f66e2b"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "terms" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "terms" DROP COLUMN "version"`);
        await queryRunner.query(`DROP TABLE "history_log_entity"`);
        await queryRunner.query(`DROP TYPE "public"."history_log_entity_action_enum"`);
        await queryRunner.query(`DROP TABLE "user_term_acceptances"`);
    }

}
