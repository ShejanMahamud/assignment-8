import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompleteServiceDto } from './dto/complete-service.dto';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicingService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateServiceDto) {
    const result = await this.prisma.$transaction(async (tx) => {
      const bike = await tx.bike.findUnique({
        where: {
          bikeId: dto.bikeId,
        },
      });
      if (!bike) throw new NotFoundException('Bike not found');
      const service = await tx.serviceRecord.create({
        data: {
          ...dto,
        },
      });
      return service;
    });
    return {
      success: true,
      message: 'Service record created successfully',
      data: result,
    };
  }

  async getServices(take: number, cursor: string) {
    const queryOptions: Prisma.ServiceRecordFindManyArgs = {
      take,
      orderBy: {
        serviceId: 'asc',
      },
    };

    if (cursor) {
      queryOptions.skip = 1;
      queryOptions.cursor = { serviceId: cursor };
    }
    const services = await this.prisma.serviceRecord.findMany(queryOptions);
    const hasNextPage = !!take || !!cursor;

    return {
      success: true,
      message: 'Service records fetched successfully',
      data: services,
      ...(hasNextPage && {
        meta: {
          limit: take,
          count: services.length,
          nextCursor:
            services.length > 0
              ? services[services.length - 1].serviceId
              : null,
          nextPage: services.length === take,
        },
      }),
    };
  }

  async getService(id: string) {
    const service = await this.prisma.serviceRecord.findUnique({
      where: {
        serviceId: id,
      },
    });
    if (!service) throw new NotFoundException('Service not found!');
    return {
      success: true,
      message: 'Service record fetched successfully',
      data: service,
    };
  }

  async markAsComplete(id: string, dto: CompleteServiceDto) {
    const result = await this.prisma.$transaction(async (tx) => {
      const service = await tx.serviceRecord.findUnique({
        where: {
          serviceId: id,
        },
      });
      if (!service) throw new NotFoundException('Service not found');
      if (service.status === 'done')
        throw new BadRequestException('Service is already completed');
      const updatedService = await tx.serviceRecord.update({
        where: {
          serviceId: service.serviceId,
        },
        data: {
          completionDate: dto.completionDate ?? new Date(),
        },
      });
      return updatedService;
    });
    return {
      success: true,
      message: 'Service marked as completed',
      data: result,
    };
  }

  async statusCheck() {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    const services = await this.prisma.serviceRecord.findMany({
      where: {
        OR: [
          {
            status: 'in_progress',
          },
          {
            status: 'pending',
          },
        ],
        AND: [
          {
            serviceDate: {
              gte: sevenDaysAgo,
              lte: today,
            },
          },
        ],
      },
    });
    return {
      success: true,
      message: 'Overdue or pending services fetched successfully',
      data: services,
    };
  }
}
