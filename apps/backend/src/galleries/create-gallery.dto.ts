import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class CreateGalleryDto {
  @ApiProperty({
    minLength: 1,
    maxLength: 160,
    example: 'Sommer in den Bergen',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @Length(1, 160)
  title!: string;
}
