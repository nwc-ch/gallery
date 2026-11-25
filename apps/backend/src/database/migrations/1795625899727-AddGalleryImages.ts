import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGalleryImages1795625899727 implements MigrationInterface {
  name = 'AddGalleryImages1795625899727';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`gallery_images\` (\`id\` uuid NOT NULL, \`galleryId\` uuid NOT NULL, \`filename\` varchar(255) NOT NULL, \`originalKey\` varchar(512) NOT NULL, \`previewKey\` varchar(512) NOT NULL, \`width\` int UNSIGNED NOT NULL, \`height\` int UNSIGNED NOT NULL, \`byteSize\` int UNSIGNED NOT NULL, \`createdAt\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), INDEX \`IDX_d3cb08521925b64e31a3634862\` (\`galleryId\`, \`createdAt\`, \`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`gallery_images\` ADD CONSTRAINT \`FK_5ae7da50fb201e95d10a6364653\` FOREIGN KEY (\`galleryId\`) REFERENCES \`galleries\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`gallery_images\` DROP FOREIGN KEY \`FK_5ae7da50fb201e95d10a6364653\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_d3cb08521925b64e31a3634862\` ON \`gallery_images\``,
    );
    await queryRunner.query(`DROP TABLE \`gallery_images\``);
  }
}
