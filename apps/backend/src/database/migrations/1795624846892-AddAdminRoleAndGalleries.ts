import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdminRoleAndGalleries1795624846892 implements MigrationInterface {
  name = 'AddAdminRoleAndGalleries1795624846892';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`galleries\` (\`id\` uuid NOT NULL, \`title\` varchar(160) NOT NULL, \`createdById\` varchar(255) NOT NULL, \`createdAt\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`role\` enum ('user', 'admin') NOT NULL DEFAULT 'user'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`galleries\` ADD CONSTRAINT \`FK_24c23d5a4688eacefc269622465\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`galleries\` DROP FOREIGN KEY \`FK_24c23d5a4688eacefc269622465\``,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`role\``);
    await queryRunner.query(`DROP TABLE \`galleries\``);
  }
}
