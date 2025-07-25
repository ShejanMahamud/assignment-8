import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BikeService } from './bike.service';
import { AddBikeDto } from './dto/add-bike.dto';

@Controller('bikes')
export class BikeController {
  constructor(private bike: BikeService) {}

  @Post('')
  add(@Body() dto: AddBikeDto) {
    return this.bike.add(dto);
  }

  @Get('')
  getAll(@Query() take: number, cursor: string) {
    return this.bike.getBikes(take, cursor);
  }

  @Get(':id')
  getBike(@Param() id: string) {
    return this.bike.getBike(id);
  }
}
