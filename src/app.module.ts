import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CustomerModule } from './customer/customer.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [CustomerModule, PrismaModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
