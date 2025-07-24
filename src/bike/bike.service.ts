import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddBikeDto } from './dto/add-bike.dto';

@Injectable()
export class BikeService {
  constructor(private prisma: PrismaService) {}

  async add(dto: AddBikeDto) {
    const result = await this.prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({
        where: {
          customerId: dto.customerId,
        },
      });
      if (!customer)
        throw new NotFoundException('Customer not found with this id');
      const bike = await tx.bike.create({
        data: {
          ...dto,
        },
      });
      return bike;
    });
    return {
      success: true,
      message: 'Bike added successfully',
      data: result,
    };
  }

  async getBikes(take: number, cursor?: string) {
    const queryOptions: Prisma.BikeFindManyArgs = {
      take,
      orderBy: {
        bikeId: 'asc',
      },
    };
    if (cursor) {
      queryOptions.skip = 1;
      queryOptions.cursor = { bikeId: cursor };
    }
    const bikes = await this.prisma.bike.findMany(queryOptions);
    const hasPagination = !!take || !!take;

    return {
      success: true,
      message: 'Bikes fetched successfully',
      data: bikes,
      ...(hasPagination && {
        meta: {
          limit: take,
          count: bikes.length,
          nextCursor: bikes.length > 0 ? bikes[bikes.length - 1].bikeId : null,
          hasNextPage: bikes.length === take,
        },
      }),
    };
  }

  async getBike(id: string) {
    const bike = await this.prisma.bike.findUnique({
      where: {
        bikeId: id,
      },
    });
    if (!bike) throw new NotFoundException('Bike not found with this id');
    return {
      success: true,
      message: 'Bike fetched successfully!',
      data: bike,
    };
  }
}
