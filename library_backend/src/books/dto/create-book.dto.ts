import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  publishYear: number;

  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number; // Hangi kategori? (ID olarak gelecek)

  @IsArray()
  authorIds: number[]; // Hangi yazarlar? (ID listesi olarak gelecek: [1, 2])
}
