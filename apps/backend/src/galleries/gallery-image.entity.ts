import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Gallery } from './gallery.entity.js';

@Entity('gallery_images')
@Index(['galleryId', 'createdAt', 'id'])
export class GalleryImage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  galleryId!: string;

  @ManyToOne(() => Gallery, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'galleryId' })
  gallery!: Relation<Gallery>;

  @Column({ type: 'varchar', length: 255 })
  filename!: string;

  @Column({ type: 'varchar', length: 512 })
  originalKey!: string;

  @Column({ type: 'varchar', length: 512 })
  previewKey!: string;

  @Column({ type: 'int', unsigned: true })
  width!: number;

  @Column({ type: 'int', unsigned: true })
  height!: number;

  @Column({ type: 'int', unsigned: true })
  byteSize!: number;

  @CreateDateColumn({
    type: 'datetime',
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
  })
  createdAt!: Date;
}
