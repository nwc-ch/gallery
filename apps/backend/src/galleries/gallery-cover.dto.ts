import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNumber,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CoverCropDto {
  @ApiProperty({ minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  x!: number;

  @ApiProperty({ minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  y!: number;

  @ApiProperty({ minimum: 0.000001, maximum: 1 })
  @IsNumber()
  @Min(0.000001)
  @Max(1)
  width!: number;

  @ApiProperty({ minimum: 0.000001, maximum: 1 })
  @IsNumber()
  @Min(0.000001)
  @Max(1)
  height!: number;
}

export class SetGalleryCoverDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  imageId!: string;

  @ApiProperty({
    type: CoverCropDto,
    description:
      'Normalisierte Koordinaten im ausgerichteten Bild, Seitenverhältnis 3:2',
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => CoverCropDto)
  crop!: CoverCropDto;
}
