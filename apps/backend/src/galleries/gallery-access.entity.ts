import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Gallery } from './gallery.entity.js';
import { User } from '../users/user.entity.js';

@Entity('gallery_access')
@Index(['userId', 'galleryId'])
export class GalleryAccess {
  @PrimaryColumn({ type: 'uuid' })
  galleryId!: string;

  @PrimaryColumn({ type: 'varchar', length: 255 })
  userId!: string;

  @ManyToOne(() => Gallery, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'galleryId' })
  gallery!: Relation<Gallery>;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: Relation<User>;
}
