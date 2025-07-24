import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private customer: CustomerService) {}
  @Post('')
  create(dto: CreateCustomerDto) {
    return this.customer.create(dto);
  }

  @Put(':id')
  update(@Param() id: string, @Body() dto: UpdateCustomerDto) {
    return this.customer.update(id, dto);
  }

  @Delete(':id')
  delete(@Param() id: string) {
    return this.customer.delete(id);
  }
}
