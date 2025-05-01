import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRole1746106089009 implements MigrationInterface {
    name = 'AddUserRole1746106089009'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('EMPLOYEE', 'ADMIN')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'EMPLOYEE'`);
        await queryRunner.query(`ALTER TABLE "terms" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "terms" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "terms" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "terms" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "terms" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "terms" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
