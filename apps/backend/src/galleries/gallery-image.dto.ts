import { ApiProperty } from '@nestjs/swagger';

export class GalleryImageDto {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty() filename!: string;
  @ApiProperty() width!: number;
  @ApiProperty() height!: number;
  @ApiProperty() byteSize!: number;
  @ApiProperty() previewUrl!: string;
  @ApiProperty() originalUrl!: string;
  @ApiProperty({ type: String, format: 'date-time' }) createdAt!: Date;
}

export class GalleryImagesDto {
  @ApiProperty({ type: [GalleryImageDto] }) images!: GalleryImageDto[];
  @ApiProperty() uploadAvailable!: boolean;
}
