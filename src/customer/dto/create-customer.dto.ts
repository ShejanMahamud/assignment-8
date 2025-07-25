import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    type: 'string',
    description: 'This is a required property',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    type: 'string',
    description: 'This is a required property',
    example: 'johndoe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    type: 'string',
    description: 'This is a required property',
    example: '8801644494180',
  })
  @IsString()
  @IsNotEmpty()
  readonly phone: string;
}
