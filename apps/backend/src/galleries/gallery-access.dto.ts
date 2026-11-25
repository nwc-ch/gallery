import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AuthUser } from '../auth/auth.types.js';

export class UpdateGalleryAccessDto {
  @ApiProperty({
    type: [String],
    description:
      'IDs der Benutzer, die dieses Album sehen dürfen. Eine leere Liste entfernt alle expliziten Freigaben.',
    maxItems: 5000,
    uniqueItems: true,
  })
  @IsArray()
  @ArrayMaxSize(5000)
  @ArrayUnique()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(255, { each: true })
  userIds!: string[];
}

export class GalleryAccessDto {
  @ApiProperty({ type: [AuthUser] })
  users!: AuthUser[];

  @ApiProperty({ type: [String] })
  userIds!: string[];
}
