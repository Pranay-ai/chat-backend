import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration0206251230pm1738873719718 implements MigrationInterface {
    name = 'Migration0206251230pm1738873719718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "displaName" TO "displayName"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "displayName" TO "displaName"`);
    }

}
