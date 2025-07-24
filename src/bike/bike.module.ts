import { Module } from '@nestjs/common';
import { BikeController } from './bike.controller';
import { BikeService } from './bike.service';

@Module({
  imports: [],
  providers: [BikeService],
  controllers: [BikeController],
})
export class BikeModule {}
