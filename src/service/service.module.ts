import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServicingService } from './service.service';

@Module({
  imports: [],
  providers: [ServicingService],
  controllers: [ServiceController],
})
export class ServiceModule {}
