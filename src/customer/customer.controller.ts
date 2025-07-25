import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(private customer: CustomerService) {}

  @Post('')
  @ApiBody({
    description: 'Customer Create Body',
    type: CreateCustomerDto,
    isArray: false,
  })
  @ApiCreatedResponse({
    description: 'Customer Created Successfully',
    type: CreateCustomerDto,
    isArray: false,
  })
  @Apibadre
  create(dto: CreateCustomerDto) {
    return this.customer.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  update(@Param() id: string, @Body() dto: UpdateCustomerDto) {
    return this.customer.update(id, dto);
  }

  @Delete(':id')
  delete(@Param() id: string) {
    return this.customer.delete(id);
  }
}
