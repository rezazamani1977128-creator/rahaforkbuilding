import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  Payment,
  PaymentStatus,
  ChargeStatus,
  FundTransactionType,
  Prisma,
} from '@prisma/client';
import {
  CreatePaymentDto,
  CreateBulkPaymentDto,
  VerifyPaymentDto,
  PaymentQueryDto,
} from './dto';
import { MESSAGES } from '../../common/constants/messages.constants';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  // ========================
  // Payment Creation
  // ========================

  async create(
    buildingId: string,
    createDto: CreatePaymentDto,
    createdById: string,
  ): Promise<Payment> {
    // Validate unit belongs to building
    const unit = await this.prisma.unit.findFirst({
      where: { id: createDto.unitId, buildingId },
    });
    if (!unit) {
      throw new NotFoundException('واحد یافت نشد');
    }

    // Validate charge belongs to building
    const charge = await this.prisma.charge.findFirst({
      where: { id: createDto.chargeId, buildingId },
    });
    if (!charge) {
      throw new NotFoundException(MESSAGES.CHARGE.NOT_FOUND);
    }

    // If chargeUnitItemId provided, validate it
    let chargeUnitItem;
    if (createDto.chargeUnitItemId) {
      chargeUnitItem = await this.prisma.chargeUnitItem.findFirst({
        where: {
          id: createDto.chargeUnitItemId,
          unitId: createDto.unitId,
          chargeId: createDto.chargeId,
        },
      });
      if (!chargeUnitItem) {
        throw new NotFoundException('آیتم شارژ واحد یافت نشد');
      }

      // Check if already fully paid
      if (chargeUnitItem.isPaid) {
        throw new BadRequestException('این شارژ قبلاً پرداخت شده است');
      }

      // Validate payment amount doesn't exceed remaining
      const remaining =
        Number(chargeUnitItem.amount) -
        Number(chargeUnitItem.paidAmount) +
        Number(chargeUnitItem.lateFee);
      if (createDto.amount > remaining) {
        throw new BadRequestException(
          `مبلغ پرداختی بیش از مانده (${remaining} ریال) است`,
        );
      }
    }

    // Generate reference number if not provided
    const referenceNumber =
      createDto.method === 'CASH'
        ? `CASH-${Date.now()}`
        : createDto.bankReferenceNumber || `PAY-${Date.now()}`;

    // Find unit owner to set as userId - fallback to createdBy
    let userId = createdById;
    if (createDto.unitId) {
      const unitOwner = await this.prisma.buildingMember.findFirst({
        where: {
          unitId: createDto.unitId,
          role: 'OWNER' as any,
        },
        select: { userId: true },
      });
      if (unitOwner) {
        userId = unitOwner.userId;
      }
    }

    return this.prisma.payment.create({
      data: {
        buildingId,
        userId,
        unitId: createDto.unitId,
        chargeId: createDto.chargeId,
        chargeUnitItemId: createDto.chargeUnitItemId,
        amount: createDto.amount,
        method: createDto.method,
        status: PaymentStatus.PENDING,
        referenceNumber,
        bankReferenceNumber: createDto.bankReferenceNumber,
        note: createDto.note,
        createdById,
      },
      include: {
        unit: {
          select: { id: true, number: true, floor: true },
        },
        charge: {
          select: { id: true, title: true, type: true, dueDate: true },
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async createBulkPayment(
    buildingId: string,
    createDto: CreateBulkPaymentDto,
    createdById: string,
  ): Promise<Payment[]> {
    // Validate unit
    const unit = await this.prisma.unit.findFirst({
      where: { id: createDto.unitId, buildingId },
    });
    if (!unit) {
      throw new NotFoundException('واحد یافت نشد');
    }

    // Validate all charge unit items
    const chargeUnitItemIds = createDto.items.map((i) => i.chargeUnitItemId);
    const chargeUnitItems = await this.prisma.chargeUnitItem.findMany({
      where: {
        id: { in: chargeUnitItemIds },
        unitId: createDto.unitId,
      },
      include: { charge: true },
    });

    if (chargeUnitItems.length !== createDto.items.length) {
      throw new BadRequestException('یک یا چند آیتم شارژ معتبر نیست');
    }

    // Validate amounts and not already paid
    for (const item of createDto.items) {
      const chargeItem = chargeUnitItems.find(
        (ci) => ci.id === item.chargeUnitItemId,
      );
      if (!chargeItem) {
        throw new BadRequestException('آیتم شارژ پیدا نشد');
      }
      if (chargeItem.isPaid) {
        throw new BadRequestException(
          `شارژ ${chargeItem.charge.title} قبلاً پرداخت شده است`,
        );
      }
      const remaining =
        Number(chargeItem.amount) -
        Number(chargeItem.paidAmount) +
        Number(chargeItem.lateFee);
      if (item.amount > remaining) {
        throw new BadRequestException(
          `مبلغ پرداختی برای ${chargeItem.charge.title} بیش از مانده است`,
        );
      }
    }

    // Find unit owner to set as userId - fallback to createdBy
    let userId = createdById;
    if (createDto.unitId) {
      const unitOwner = await this.prisma.buildingMember.findFirst({
        where: {
          unitId: createDto.unitId,
          role: 'OWNER' as any,
        },
        select: { userId: true },
      });
      if (unitOwner) {
        userId = unitOwner.userId;
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const payments: Payment[] = [];

      for (const item of createDto.items) {
        const chargeItem = chargeUnitItems.find(
          (ci) => ci.id === item.chargeUnitItemId,
        );
        if (!chargeItem) {
          throw new BadRequestException('آیتم شارژ پیدا نشد');
        }

        const referenceNumber =
          createDto.method === 'CASH'
            ? `CASH-${Date.now()}-${chargeItem.charge.id.substring(0, 8)}`
            : createDto.bankReferenceNumber ||
              `PAY-${Date.now()}-${chargeItem.charge.id.substring(0, 8)}`;

        const payment = await tx.payment.create({
          data: {
            buildingId,
            userId,
            unitId: createDto.unitId,
            chargeId: chargeItem.chargeId,
            chargeUnitItemId: item.chargeUnitItemId,
            amount: item.amount,
            method: createDto.method,
            status: PaymentStatus.PENDING,
            referenceNumber,
            bankReferenceNumber: createDto.bankReferenceNumber,
            note: createDto.note,
            createdById,
          },
        });

        payments.push(payment);
      }

      return payments;
    });
  }

  // ========================
  // Payment Verification (CRITICAL - includes fund integration)
  // ========================

  async verify(
    buildingId: string,
    paymentId: string,
    verifyDto: VerifyPaymentDto,
    verifiedById: string,
  ): Promise<Payment> {
    const payment = await this.prisma.payment.findFirst({
      where: { id: paymentId, buildingId },
      include: { chargeUnitItem: true },
    });

    if (!payment) {
      throw new NotFoundException(MESSAGES.PAYMENT.NOT_FOUND);
    }

    if (payment.status !== PaymentStatus.PENDING) {
      throw new ConflictException('این پرداخت قبلاً بررسی شده است');
    }

    return this.prisma.$transaction(
      async (tx) => {
        // Step 1: Update payment with optimistic locking
        const updatedPayment = await tx.payment.updateMany({
          where: {
            id: paymentId,
            status: PaymentStatus.PENDING, // Optimistic lock
          },
          data: {
            status: verifyDto.status,
            verifiedById,
            verifiedAt: new Date(),
            verificationNote: verifyDto.verificationNote,
            referenceNumber:
              verifyDto.referenceNumber || payment.referenceNumber,
          },
        });

        if (updatedPayment.count === 0) {
          throw new ConflictException(
            'پرداخت توسط کاربر دیگری تأیید شده است',
          );
        }

        // Step 2: If verified, update charge unit item and fund
        if (verifyDto.status === PaymentStatus.VERIFIED) {
          if (payment.chargeUnitItemId && payment.chargeUnitItem) {
            const chargeUnitItem = payment.chargeUnitItem;
            const newPaidAmount =
              Number(chargeUnitItem.paidAmount) + Number(payment.amount);
            const totalDue =
              Number(chargeUnitItem.amount) + Number(chargeUnitItem.lateFee);
            const isPaid = newPaidAmount >= totalDue;

            await tx.chargeUnitItem.update({
              where: { id: payment.chargeUnitItemId },
              data: {
                paidAmount: newPaidAmount,
                isPaid,
              },
            });

            // Step 3: Check if all unit items for this charge are paid
            const allUnitItems = await tx.chargeUnitItem.findMany({
              where: { chargeId: chargeUnitItem.chargeId },
            });

            const allPaid = allUnitItems.every((item) => item.isPaid);
            const anyPaid = allUnitItems.some(
              (item) => Number(item.paidAmount) > 0,
            );

            // Update charge status
            let chargeStatus: ChargeStatus;
            if (allPaid) {
              chargeStatus = ChargeStatus.PAID;
            } else if (anyPaid) {
              chargeStatus = ChargeStatus.PARTIALLY_PAID;
            } else {
              chargeStatus = ChargeStatus.ACTIVE;
            }

            await tx.charge.update({
              where: { id: chargeUnitItem.chargeId },
              data: { status: chargeStatus },
            });
          }

          // Step 4: Update building fund balance
          const fund = await tx.buildingFund.findUnique({
            where: { buildingId },
          });

          if (!fund) {
            throw new NotFoundException('صندوق ساختمان یافت نشد');
          }

          await tx.buildingFund.update({
            where: { buildingId },
            data: {
              balance: { increment: payment.amount },
            },
          });

          // Step 5: Create fund transaction record
          await tx.fundTransaction.create({
            data: {
              buildingId,
              fundId: fund.id,
              type: FundTransactionType.INCOME,
              amount: payment.amount,
              description: `پرداخت شارژ - ${payment.referenceNumber}`,
              referenceType: 'PAYMENT',
              referenceId: payment.id,
              createdById: verifiedById,
            },
          });
        }

        // Return updated payment with relations
        const updated = await tx.payment.findUnique({
          where: { id: paymentId },
          include: {
            unit: {
              select: { id: true, number: true, floor: true },
            },
            charge: {
              select: { id: true, title: true, type: true, dueDate: true },
            },
            createdBy: {
              select: { id: true, firstName: true, lastName: true },
            },
            verifiedBy: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        });
        
        if (!updated) {
          throw new NotFoundException(MESSAGES.PAYMENT.NOT_FOUND);
        }
        
        return updated as Payment;
      },
      { timeout: 15000 },
    );
  }

  // ========================
  // Queries
  // ========================

  async findAll(
    buildingId: string,
    query: PaymentQueryDto,
  ): Promise<PaginatedResponseDto<Payment>> {
    const {
      page = 1,
      limit = 10,
      unitId,
      chargeId,
      status,
      method,
      fromDate,
      toDate,
      pendingOnly,
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.PaymentWhereInput = { buildingId };

    if (unitId) where.unitId = unitId;
    if (chargeId) where.chargeId = chargeId;
    if (status) where.status = status;
    if (method) where.method = method;
    if (pendingOnly) where.status = PaymentStatus.PENDING;

    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt.gte = new Date(fromDate);
      if (toDate) where.createdAt.lte = new Date(toDate);
    }

    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          unit: {
            select: { id: true, number: true, floor: true },
          },
          charge: {
            select: { id: true, title: true, type: true, dueDate: true },
          },
          createdBy: {
            select: { id: true, firstName: true, lastName: true },
          },
          verifiedBy: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      }),
      this.prisma.payment.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(buildingId: string, paymentId: string): Promise<Payment> {
    const payment = await this.prisma.payment.findFirst({
      where: { id: paymentId, buildingId },
      include: {
        unit: {
          select: { id: true, number: true, floor: true },
        },
        charge: {
          select: { id: true, title: true, type: true, dueDate: true },
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        verifiedBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException(MESSAGES.PAYMENT.NOT_FOUND);
    }

    return payment;
  }

  // ========================
  // Stats & Reports
  // ========================

  async getPaymentStats(buildingId: string) {
    const [totalPayments, pendingPayments, verifiedAgg, pendingAgg] =
      await Promise.all([
        this.prisma.payment.count({ where: { buildingId } }),
        this.prisma.payment.count({
          where: { buildingId, status: PaymentStatus.PENDING },
        }),
        this.prisma.payment.aggregate({
          where: { buildingId, status: PaymentStatus.VERIFIED },
          _sum: { amount: true },
        }),
        this.prisma.payment.aggregate({
          where: { buildingId, status: PaymentStatus.PENDING },
          _sum: { amount: true },
        }),
      ]);

    return {
      totalPayments,
      pendingPayments,
      totalVerified: verifiedAgg._sum.amount || 0,
      totalPending: pendingAgg._sum.amount || 0,
    };
  }
}
