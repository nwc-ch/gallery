import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGalleryAccess1795634030766 implements MigrationInterface {
  name = 'AddGalleryAccess1795634030766';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`gallery_access\` (\`galleryId\` uuid NOT NULL, \`userId\` varchar(255) NOT NULL, INDEX \`IDX_94bfe069b90fbc8a98de75eccd\` (\`userId\`, \`galleryId\`), PRIMARY KEY (\`galleryId\`, \`userId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`gallery_access\` ADD CONSTRAINT \`FK_21b316f537fffa64413be0dfae9\` FOREIGN KEY (\`galleryId\`) REFERENCES \`galleries\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`gallery_access\` ADD CONSTRAINT \`FK_e376e0afbd0e7e799455757b5d4\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`gallery_access\` DROP FOREIGN KEY \`FK_e376e0afbd0e7e799455757b5d4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`gallery_access\` DROP FOREIGN KEY \`FK_21b316f537fffa64413be0dfae9\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_94bfe069b90fbc8a98de75eccd\` ON \`gallery_access\``,
    );
    await queryRunner.query(`DROP TABLE \`gallery_access\``);
  }
}
