import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CompleteServiceDto } from './dto/complete-service.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServicingService } from './service.service';

@Controller('services')
export class ServiceController {
  constructor(private service: ServicingService) {}

  @Post('')
  create(dto: CreateServiceDto) {
    return this.service.create(dto);
  }

  @Get('')
  getAll(@Query() take: number, cursor: string) {
    return this.service.getServices(take, cursor);
  }

  @Get(':id')
  getService(@Param() id: string) {
    return this.service.getService(id);
  }

  @Put(':id/complete')
  markAsComplete(@Param() id: string, @Body() dto: CompleteServiceDto) {
    return this.service.markAsComplete(id, dto);
  }

  @Get('status')
  getStatus() {
    return this.service.statusCheck();
  }
}
