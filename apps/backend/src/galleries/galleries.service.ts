import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gallery } from './gallery.entity.js';

@Injectable()
export class GalleriesService {
  constructor(
    @InjectRepository(Gallery) private readonly galleries: Repository<Gallery>,
  ) {}

  list(): Promise<Gallery[]> {
    return this.galleries.find({ order: { createdAt: 'DESC', id: 'DESC' } });
  }

  create(title: string, createdById: string): Promise<Gallery> {
    return this.galleries.save(this.galleries.create({ title, createdById }));
  }
}
