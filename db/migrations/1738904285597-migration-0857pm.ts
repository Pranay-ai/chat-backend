import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration0857pm1738904285597 implements MigrationInterface {
    name = 'Migration0857pm1738904285597'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "profilePicture" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profilePicture"`);
    }

}
