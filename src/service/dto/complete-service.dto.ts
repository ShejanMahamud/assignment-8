import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class CompleteServiceDto {
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  readonly completionDate?: Date;
}
