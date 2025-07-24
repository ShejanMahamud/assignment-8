import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddBikeDto {
  @IsString()
  @IsNotEmpty()
  readonly brand: string;

  @IsString()
  @IsNotEmpty()
  readonly model: string;

  @IsNumber()
  @IsNotEmpty()
  readonly year: number;

  @IsString()
  @IsNotEmpty()
  readonly customerId: string;
}
