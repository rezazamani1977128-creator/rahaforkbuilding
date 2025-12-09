import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  Charge,
  ChargeItem,
  ChargeUnitItem,
  ChargeStatus,
  ChargeDistributionMethod,
  Prisma,
} from '@prisma/client';
import {
  CreateChargeDto,
  UpdateChargeDto,
  UpdateChargeStatusDto,
  CreateCustomChargeDto,
  ChargeQueryDto,
  UnitChargeQueryDto,
} from './dto';
import { MESSAGES } from '../../common/constants/messages.constants';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable()
export class ChargesService {
  constructor(private readonly prisma: PrismaService) {}

  // ========================
  // Charge CRUD
  // ========================

  async create(
    buildingId: string,
    createDto: CreateChargeDto,
    createdById: string,
  ): Promise<Charge> {
    // Validate building exists
    const building = await this.prisma.building.findUnique({
      where: { id: buildingId },
      include: { units: true },
    });

    if (!building) {
      throw new NotFoundException(MESSAGES.BUILDING.NOT_FOUND);
    }

    if (building.units.length === 0) {
      throw new BadRequestException('ساختمان فاقد واحد است. ابتدا واحدها را ثبت کنید.');
    }

    return this.prisma.$transaction(async (tx) => {
      // Create the charge
      const charge = await tx.charge.create({
        data: {
          buildingId,
          createdById,
          title: createDto.title,
          description: createDto.description,
          type: createDto.type,
          distributionMethod: createDto.distributionMethod,
          totalAmount: createDto.totalAmount,
          dueDate: createDto.dueDate,
          periodStart: createDto.periodStart,
          periodEnd: createDto.periodEnd,
          lateFeePercentage: createDto.lateFeePercentage || 0,
          status: ChargeStatus.DRAFT,
          month: createDto.dueDate.getMonth() + 1,
          year: createDto.dueDate.getFullYear(),
        },
      });

      // Create charge items if provided
      if (createDto.items && createDto.items.length > 0) {
        await tx.chargeItem.createMany({
          data: createDto.items.map((item) => ({
            chargeId: charge.id,
            title: item.title,
            amount: item.amount,
            category: 'OTHER' as any,
            description: item.description,
          })),
        });
      }

      // Distribute charge to units
      await this.distributeChargeToUnits(
        tx,
        charge.id,
        buildingId,
        createDto.totalAmount,
        createDto.distributionMethod,
        building.units,
      );

      return this.findOne(buildingId, charge.id);
    }, { timeout: 10000 });
  }

  private async distributeChargeToUnits(
    tx: Prisma.TransactionClient,
    chargeId: string,
    buildingId: string,
    totalAmount: number,
    method: ChargeDistributionMethod,
    units: any[],
  ): Promise<void> {
    const unitCharges: Prisma.ChargeUnitItemCreateManyInput[] = [];

    switch (method) {
      case ChargeDistributionMethod.EQUAL:
        const equalAmount = Math.floor(totalAmount / units.length);
        const remainder = totalAmount - equalAmount * units.length;

        units.forEach((unit, index) => {
          unitCharges.push({
            chargeId,
            unitId: unit.id,
            amount: equalAmount + (index === 0 ? remainder : 0),
            paidAmount: 0,
            lateFee: 0,
            isPaid: false,
          });
        });
        break;

      case ChargeDistributionMethod.BY_AREA:
        const totalArea = units.reduce((sum, u) => sum + (u.area || 0), 0);
        if (totalArea === 0) {
          throw new BadRequestException(
            'متراژ واحدها ثبت نشده است. امکان توزیع بر اساس متراژ وجود ندارد.',
          );
        }

        units.forEach((unit) => {
          const unitArea = unit.area || 0;
          const amount = Math.round((unitArea / totalArea) * totalAmount);
          unitCharges.push({
            chargeId,
            unitId: unit.id,
            amount,
            paidAmount: 0,
            lateFee: 0,
            isPaid: false,
          });
        });
        break;

      case ChargeDistributionMethod.BY_COEFFICIENT:
        const totalCoefficient = units.reduce(
          (sum, u) => sum + (u.coefficient || 1),
          0,
        );

        units.forEach((unit) => {
          const coefficient = unit.coefficient || 1;
          const amount = Math.round(
            (coefficient / totalCoefficient) * totalAmount,
          );
          unitCharges.push({
            chargeId,
            unitId: unit.id,
            amount,
            paidAmount: 0,
            lateFee: 0,
            isPaid: false,
          });
        });
        break;

      case ChargeDistributionMethod.BY_RESIDENT_COUNT:
        const totalResidents = units.reduce(
          (sum, u) => sum + (u.residentsCount || 1),
          0,
        );

        units.forEach((unit) => {
          const residents = unit.residentsCount || 1;
          const amount = Math.round((residents / totalResidents) * totalAmount);
          unitCharges.push({
            chargeId,
            unitId: unit.id,
            amount,
            paidAmount: 0,
            lateFee: 0,
            isPaid: false,
          });
        });
        break;

      case ChargeDistributionMethod.CUSTOM:
        // For custom, we don't distribute here - it's done separately
        return;

      default:
        throw new BadRequestException('روش توزیع نامعتبر است');
    }

    // Adjust for rounding errors
    const distributedTotal = unitCharges.reduce((sum, uc) => sum + Number(uc.amount), 0);
    if (distributedTotal !== totalAmount && unitCharges.length > 0) {
      unitCharges[0].amount = Number(unitCharges[0].amount) + (totalAmount - distributedTotal);
    }

    await tx.chargeUnitItem.createMany({
      data: unitCharges,
    });
  }

  async createCustomCharge(
    buildingId: string,
    createDto: CreateCustomChargeDto,
    createdById: string,
  ): Promise<Charge> {
    // Validate all units exist and belong to building
    const unitIds = createDto.units.map((u) => u.unitId);
    const units = await this.prisma.unit.findMany({
      where: {
        id: { in: unitIds },
        buildingId,
      },
    });

    if (units.length !== unitIds.length) {
      throw new BadRequestException('یک یا چند واحد معتبر نیست');
    }

    const totalAmount = createDto.units.reduce((sum, u) => sum + u.amount, 0);

    return this.prisma.$transaction(async (tx) => {
      const charge = await tx.charge.create({
        data: {
          buildingId,
          createdById,
          title: createDto.title,
          description: createDto.description,
          type: 'CUSTOM',
          distributionMethod: ChargeDistributionMethod.CUSTOM,
          totalAmount,
          dueDate: createDto.dueDate,
          status: ChargeStatus.DRAFT,
          month: createDto.dueDate.getMonth() + 1,
          year: createDto.dueDate.getFullYear(),
        },
      });

      await tx.chargeUnitItem.createMany({
        data: createDto.units.map((u) => ({
          chargeId: charge.id,
          unitId: u.unitId,
          amount: u.amount,
          paidAmount: 0,
          lateFee: 0,
          isPaid: false,
          note: u.note,
        })),
      });

      return this.findOne(buildingId, charge.id);
    });
  }

  async findAll(
    buildingId: string,
    query: ChargeQueryDto,
  ): Promise<PaginatedResponseDto<Charge>> {
    const { page = 1, limit = 10, search, status, type, overdue } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ChargeWhereInput = { buildingId };

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    if (overdue) {
      where.dueDate = { lt: new Date() };
      where.status = { in: [ChargeStatus.ACTIVE, ChargeStatus.PARTIALLY_PAID] };
    }

    const [data, total] = await Promise.all([
      this.prisma.charge.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          _count: {
            select: {
              unitItems: true,
            },
          },
        },
      }),
      this.prisma.charge.count({ where }),
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

  async findOne(buildingId: string, chargeId: string): Promise<any> {
    const charge = await this.prisma.charge.findFirst({
      where: {
        id: chargeId,
        buildingId,
      },
      include: {
        items: true,
        unitItems: {
          include: {
            unit: {
              select: {
                id: true,
                number: true,
                floor: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!charge) {
      throw new NotFoundException(MESSAGES.CHARGE.NOT_FOUND);
    }

    // Calculate totals
    const totalPaid = charge.unitItems.reduce(
      (sum, uc) => sum + Number(uc.paidAmount),
      0,
    );
    const totalRemaining = charge.unitItems.reduce(
      (sum, uc) => sum + (Number(uc.amount) - Number(uc.paidAmount) + Number(uc.lateFee)),
      0,
    );
    const paidUnitsCount = charge.unitItems.filter((uc) => uc.isPaid).length;

    return {
      ...charge,
      totalPaid,
      totalRemaining,
      paidUnitsCount,
      totalUnitsCount: charge.unitItems.length,
    };
  }

  async update(
    buildingId: string,
    chargeId: string,
    updateDto: UpdateChargeDto,
  ): Promise<Charge> {
    const charge = await this.findOne(buildingId, chargeId);

    if (charge.status !== ChargeStatus.DRAFT) {
      throw new BadRequestException(
        'فقط شارژهای پیش‌نویس قابل ویرایش هستند',
      );
    }

    return this.prisma.charge.update({
      where: { id: chargeId },
      data: updateDto as any,
      include: {
        items: true,
      },
    });
  }

  async updateStatus(
    buildingId: string,
    chargeId: string,
    updateStatusDto: UpdateChargeStatusDto,
  ): Promise<Charge> {
    const charge = await this.findOne(buildingId, chargeId);

    // Validate status transitions
    const validTransitions: Record<ChargeStatus, ChargeStatus[]> = {
      [ChargeStatus.DRAFT]: [ChargeStatus.ACTIVE, ChargeStatus.CANCELLED],
      [ChargeStatus.ACTIVE]: [ChargeStatus.PARTIALLY_PAID, ChargeStatus.PAID, ChargeStatus.CANCELLED],
      [ChargeStatus.PARTIALLY_PAID]: [ChargeStatus.PAID, ChargeStatus.CANCELLED],
      [ChargeStatus.PAID]: [],
      [ChargeStatus.CANCELLED]: [],
    };

    if (!validTransitions[charge.status as ChargeStatus]?.includes(updateStatusDto.status)) {
      throw new BadRequestException(
        `تغییر وضعیت از ${charge.status} به ${updateStatusDto.status} مجاز نیست`,
      );
    }

    return this.prisma.charge.update({
      where: { id: chargeId },
      data: { status: updateStatusDto.status },
    });
  }

  async delete(buildingId: string, chargeId: string): Promise<void> {
    const charge = await this.findOne(buildingId, chargeId);

    if (charge.status !== ChargeStatus.DRAFT) {
      throw new BadRequestException('فقط شارژهای پیش‌نویس قابل حذف هستند');
    }

    // Check if any payments exist
    const hasPayments = await this.prisma.payment.findFirst({
      where: { chargeId },
    });

    if (hasPayments) {
      throw new BadRequestException(
        'این شارژ دارای پرداخت ثبت شده است و قابل حذف نیست',
      );
    }

    await this.prisma.$transaction([
      this.prisma.chargeUnitItem.deleteMany({ where: { chargeId } }),
      this.prisma.chargeItem.deleteMany({ where: { chargeId } }),
      this.prisma.charge.delete({ where: { id: chargeId } }),
    ]);
  }

  // ========================
  // Unit Charges
  // ========================

  async getUnitCharges(
    buildingId: string,
    query: UnitChargeQueryDto,
  ): Promise<PaginatedResponseDto<ChargeUnitItem>> {
    const { page = 1, limit = 10, unitId, unpaidOnly, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ChargeUnitItemWhereInput = {
      charge: { buildingId },
    };

    if (unitId) {
      where.unitId = unitId;
    }

    if (unpaidOnly) {
      where.isPaid = false;
    }

    if (status) {
      where.charge = { ...where.charge as any, status };
    }

    const [data, total] = await Promise.all([
      this.prisma.chargeUnitItem.findMany({
        where,
        skip,
        take: limit,
        include: {
          charge: {
            select: {
              id: true,
              title: true,
              type: true,
              dueDate: true,
              status: true,
            },
          },
          unit: {
            select: {
              id: true,
              number: true,
              floor: true,
            },
          },
        },
        orderBy: { charge: { dueDate: 'desc' } },
      }),
      this.prisma.chargeUnitItem.count({ where }),
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

  // ========================
  // Reports & Stats
  // ========================

  async getChargeStats(buildingId: string) {
    const [totalCharges, activeCharges, paidAmount, unpaidAmount] =
      await Promise.all([
        this.prisma.charge.count({ where: { buildingId } }),
        this.prisma.charge.count({
          where: {
            buildingId,
            status: { in: [ChargeStatus.ACTIVE, ChargeStatus.PARTIALLY_PAID] },
          },
        }),
        this.prisma.chargeUnitItem.aggregate({
          where: { charge: { buildingId } },
          _sum: { paidAmount: true },
        }),
        this.prisma.chargeUnitItem.aggregate({
          where: {
            charge: { buildingId },
            isPaid: false,
          },
          _sum: { amount: true },
        }),
      ]);

    return {
      totalCharges,
      activeCharges,
      totalPaid: paidAmount._sum.paidAmount || 0,
      totalUnpaid: unpaidAmount._sum.amount || 0,
    };
  }
}
