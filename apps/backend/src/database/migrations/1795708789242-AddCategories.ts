import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCategories1795708789242 implements MigrationInterface {
  name = 'AddCategories1795708789242';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`categories\` (\`id\` uuid NOT NULL, \`name\` varchar(80) NOT NULL, UNIQUE INDEX \`IDX_8b0be371d28245da6e4f4b6187\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`gallery_categories\` (\`galleryId\` uuid NOT NULL, \`categoryId\` uuid NOT NULL, INDEX \`IDX_12391b7cd093afec0c01cf48b8\` (\`galleryId\`), INDEX \`IDX_d826636dce971190f6b6d1d190\` (\`categoryId\`), PRIMARY KEY (\`galleryId\`, \`categoryId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`gallery_categories\` ADD CONSTRAINT \`FK_12391b7cd093afec0c01cf48b8f\` FOREIGN KEY (\`galleryId\`) REFERENCES \`galleries\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`gallery_categories\` ADD CONSTRAINT \`FK_d826636dce971190f6b6d1d1908\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`gallery_categories\` DROP FOREIGN KEY \`FK_d826636dce971190f6b6d1d1908\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`gallery_categories\` DROP FOREIGN KEY \`FK_12391b7cd093afec0c01cf48b8f\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_d826636dce971190f6b6d1d190\` ON \`gallery_categories\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_12391b7cd093afec0c01cf48b8\` ON \`gallery_categories\``,
    );
    await queryRunner.query(`DROP TABLE \`gallery_categories\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_8b0be371d28245da6e4f4b6187\` ON \`categories\``,
    );
    await queryRunner.query(`DROP TABLE \`categories\``);
  }
}
