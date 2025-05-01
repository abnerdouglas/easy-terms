import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTerm1746069780255 implements MigrationInterface {
    name = 'CreateTerm1746069780255'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "terms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "content" text NOT NULL, CONSTRAINT "PK_33b6fe77d6ace7ff43cc8a65958" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "age"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "CPF"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "CPF" character varying(14) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "age" character varying(2) NOT NULL`);
        await queryRunner.query(`DROP TABLE "terms"`);
    }

}
