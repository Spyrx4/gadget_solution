import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    // Use a transaction to ensure atomicity
    return this.prisma.$transaction(async (tx) => {
      let totalPrice = new Prisma.Decimal(0);
      const orderItems: { productId: string; quantity: number; priceAtTime: Prisma.Decimal }[] = [];

      // Validate stock and calculate total
      for (const item of dto.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Product "${item.productId}" not found`);
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`,
          );
        }

        const itemTotal = product.price.mul(item.quantity);
        totalPrice = totalPrice.add(itemTotal);

        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          priceAtTime: product.price,
        });

        // Decrement stock
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Create order with items
      const order = await tx.order.create({
        data: {
          userId,
          totalPrice,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, category: true, images: true },
              },
            },
          },
        },
      });

      return order;
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, category: true, images: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId?: string) {
    const where: any = { id };
    if (userId) where.userId = userId;

    const order = await this.prisma.order.findFirst({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order "${id}" not found`);
    }

    return order;
  }

  async updateStatus(id: string, status: string) {
    const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    if (!validStatuses.includes(status)) {
      throw new BadRequestException(`Invalid status "${status}"`);
    }

    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Order "${id}" not found`);
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: status as any },
      include: {
        items: { include: { product: true } },
      },
    });
  }

  // Admin: get all orders
  async findAll(query: { status?: string; page?: number; limit?: number }) {
    const { status, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true } },
          items: { include: { product: { select: { id: true, name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
