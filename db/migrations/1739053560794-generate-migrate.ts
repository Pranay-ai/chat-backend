import { MigrationInterface, QueryRunner } from "typeorm";

export class GenerateMigrate1739053560794 implements MigrationInterface {
    name = 'GenerateMigrate1739053560794'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "emailVerified" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "emailVerified"`);
    }

}
