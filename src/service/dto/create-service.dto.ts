import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ServiceStatus } from 'generated/prisma';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  readonly bikeId: string;

  @IsDate()
  @IsNotEmpty()
  readonly serviceDate: Date;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsEnum(ServiceStatus)
  @IsNotEmpty()
  readonly status: ServiceStatus;
}
