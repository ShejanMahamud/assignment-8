import { Injectable, NotFoundException } from '@nestjs/common';
import { Customer, Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCustomerDto) {
    const customer = await this.prisma.customer.create({
      data: {
        ...dto,
      },
    });
    return {
      success: true,
      data: customer,
      message: 'Customer created successfully',
    };
  }

  async getAllCustomers(
    take: number = 10,
    cursor?: string,
  ): Promise<{
    success: boolean;
    data: Customer[];
    message: string;
    meta?: {
      limit: number;
      count: number;
      nextCursor: string | null;
      hasNextPage: boolean;
    };
  }> {
    const queryOptions: Prisma.CustomerFindManyArgs = {
      take,
      orderBy: {
        customerId: 'asc',
      },
    };

    if (cursor) {
      queryOptions.skip = 1;
      queryOptions.cursor = { customerId: cursor };
    }

    const customers = await this.prisma.customer.findMany(queryOptions);

    const hasPagination = !!take || !!cursor;

    return {
      success: true,
      data: customers,
      message: 'Customers fetched successfully',
      ...(hasPagination && {
        meta: {
          limit: take,
          count: customers.length,
          nextCursor:
            customers.length > 0
              ? customers[customers.length - 1].customerId
              : null,
          hasNextPage: customers.length === take,
        },
      }),
    };
  }

  async getCustomer(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        customerId: id,
      },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return {
      success: true,
      data: customer,
      message: 'Customer fetched successfully',
    };
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const result = await this.prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({
        where: {
          customerId: id,
        },
      });
      if (!customer) throw new NotFoundException('Customer not found');
      const updatedCustomer = await tx.customer.update({
        where: {
          customerId: customer.customerId,
        },
        data: {
          ...dto,
        },
      });
      return updatedCustomer;
    });
    return {
      success: true,
      message: 'Customer updated successfully',
      data: result,
    };
  }

  async delete(id: string) {
    const result = await this.prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({
        where: {
          customerId: id,
        },
      });
      if (!customer) throw new NotFoundException('Customer not found');
      await tx.customer.delete({
        where: {
          customerId: customer.customerId,
        },
      });
      return {
        success: true,
        message: 'Customer deleted successfully',
      };
    });
    return result;
  }
}
