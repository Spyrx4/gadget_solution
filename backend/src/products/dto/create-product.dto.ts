import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, IsObject, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsObject()
  techSpecs: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
