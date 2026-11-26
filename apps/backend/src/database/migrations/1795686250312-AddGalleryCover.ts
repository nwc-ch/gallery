import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGalleryCover1795686250312 implements MigrationInterface {
  name = 'AddGalleryCover1795686250312';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`galleries\` ADD \`coverImageId\` uuid NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`galleries\` ADD \`coverCrop\` json NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`galleries\` ADD CONSTRAINT \`FK_070f85adff339e0c2955d172c27\` FOREIGN KEY (\`coverImageId\`) REFERENCES \`gallery_images\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`galleries\` DROP FOREIGN KEY \`FK_070f85adff339e0c2955d172c27\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`galleries\` DROP COLUMN \`coverCrop\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`galleries\` DROP COLUMN \`coverImageId\``,
    );
  }
}
