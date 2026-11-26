import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from '../users/user.entity.js';
import { GalleryImage } from './gallery-image.entity.js';
import { CoverCropDto } from './gallery-cover.dto.js';

@Entity('galleries')
export class Gallery {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ maxLength: 160 })
  @Column({ type: 'varchar', length: 160 })
  title!: string;

  @ApiProperty({ type: String, format: 'uuid', nullable: true })
  @Column({ type: 'uuid', nullable: true })
  coverImageId!: string | null;

  @ApiProperty({ type: CoverCropDto, nullable: true })
  @Column({ type: 'json', nullable: true })
  coverCrop!: CoverCropDto | null;

  @ApiHideProperty()
  @ManyToOne(() => GalleryImage, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'coverImageId' })
  coverImage!: Relation<GalleryImage>;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  createdById!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'createdById' })
  createdBy!: Relation<User>;

  @ApiProperty({ type: String, format: 'date-time' })
  @CreateDateColumn({
    type: 'datetime',
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
  })
  createdAt!: Date;
}
