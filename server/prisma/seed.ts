import { PrismaClient, SystemRole, GroupRole, GroupFrequency, PayoutRule, GroupStatus, CycleStatus, PaymentMethod, ContributionStatus, PayoutStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding EthioEqub database with authentic Ethiopian Equb data...");

  // 1. Clean existing records in correct referential order
  await prisma.auditLog.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.adjustment.deleteMany();
  await prisma.contribution.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.cycle.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.equbGroup.deleteMany();
  await prisma.user.deleteMany();

  const defaultPasswordHash = await bcrypt.hash("password123", 10);

  // 2. Create Users
  const admin = await prisma.user.create({
    data: {
      email: "admin@ethioequb.com",
      phone: "+251911223344",
      fullName: "System Administrator",
      passwordHash: defaultPasswordHash,
      systemRole: SystemRole.ADMIN,
    },
  });

  const abebe = await prisma.user.create({
    data: {
      email: "abebe@gmail.com",
      phone: "+251911102030",
      fullName: "Abebe Kebede",
      passwordHash: defaultPasswordHash,
      systemRole: SystemRole.USER,
    },
  });

  const tigist = await prisma.user.create({
    data: {
      email: "tigist@gmail.com",
      phone: "+251912445566",
      fullName: "Tigist Haile",
      passwordHash: defaultPasswordHash,
      systemRole: SystemRole.USER,
    },
  });

  const chala = await prisma.user.create({
    data: {
      email: "chala@gmail.com",
      phone: "+251920778899",
      fullName: "Chala Tadesse",
      passwordHash: defaultPasswordHash,
      systemRole: SystemRole.USER,
    },
  });

  const marta = await prisma.user.create({
    data: {
      email: "marta@gmail.com",
      phone: "+251930112233",
      fullName: "Marta Bekele",
      passwordHash: defaultPasswordHash,
      systemRole: SystemRole.USER,
    },
  });

  console.log("Created 5 demo users.");

  // 3. Create Group 1: Bole Commercial Merchants Weekly Equb
  // 4 Members, 10,000 ETB (1,000,000 Santim) per week.
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 21); // Started 3 weeks ago

  const boleEqub = await prisma.equbGroup.create({
    data: {
      ownerId: abebe.id,
      name: "Bole Commercial Merchants Weekly Equb",
      description: "Rotating savings association for Bole road retail shop owners. Weekly rounds with verified Telebirr/CBE receipts.",
      contributionAmount: BigInt(1000000), // 10,000.00 ETB
      currency: "ETB",
      frequency: GroupFrequency.WEEKLY,
      totalCycles: 4,
      payoutRule: PayoutRule.JOIN_ORDER,
      requireGuarantor: true,
      allowSingleApproverIfSmall: true,
      status: GroupStatus.ACTIVE,
      startDate,
    },
  });

  // Memberships
  const memAbebe = await prisma.membership.create({
    data: {
      userId: abebe.id,
      groupId: boleEqub.id,
      roleInGroup: GroupRole.OWNER,
      payoutPosition: 1,
      guarantorName: "Kebede Wolde (Father)",
      guarantorPhone: "+251911998877",
    },
  });

  const memTigist = await prisma.membership.create({
    data: {
      userId: tigist.id,
      groupId: boleEqub.id,
      roleInGroup: GroupRole.TREASURER,
      payoutPosition: 2,
      guarantorName: "Haile Mariam (Brother)",
      guarantorPhone: "+251911554433",
    },
  });

  const memChala = await prisma.membership.create({
    data: {
      userId: chala.id,
      groupId: boleEqub.id,
      roleInGroup: GroupRole.MEMBER,
      payoutPosition: 3,
      guarantorName: "Tadesse Gemeda",
      guarantorPhone: "+251922334455",
    },
  });

  const memMarta = await prisma.membership.create({
    data: {
      userId: marta.id,
      groupId: boleEqub.id,
      roleInGroup: GroupRole.MEMBER,
      payoutPosition: 4,
      guarantorName: "Bekele Desta",
      guarantorPhone: "+251933445566",
    },
  });

  // Cycles & Payouts
  const memberships = [memAbebe, memTigist, memChala, memMarta];
  const poolAmount = BigInt(4000000); // 40,000.00 ETB

  for (let c = 1; c <= 4; c++) {
    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + (c - 1) * 7);
    const payoutDate = new Date(dueDate);

    const isCycle1or2 = c <= 2;
    const isCycle3 = c === 3;

    const cycle = await prisma.cycle.create({
      data: {
        groupId: boleEqub.id,
        cycleNumber: c,
        dueDate,
        payoutDate,
        status: isCycle1or2 ? CycleStatus.CLOSED : isCycle3 ? CycleStatus.OPEN : CycleStatus.PENDING,
      },
    });

    const recipient = memberships[c - 1];

    await prisma.payout.create({
      data: {
        cycleId: cycle.id,
        recipientId: recipient.id,
        amount: poolAmount,
        status: isCycle1or2 ? PayoutStatus.DISBURSED : PayoutStatus.SCHEDULED,
        approver1Id: isCycle1or2 ? tigist.id : null,
        approver2Id: isCycle1or2 ? abebe.id : null,
        disbursedAt: isCycle1or2 ? payoutDate : null,
        notes: isCycle1or2 ? `Cycle ${c} payout disbursed to ${recipient.userId === abebe.id ? "Abebe" : "Tigist"}` : undefined,
      },
    });

    // Record contributions for cycles
    if (isCycle1or2) {
      // All 4 members paid in cycle 1 and 2
      for (const m of memberships) {
        await prisma.contribution.create({
          data: {
            membershipId: m.id,
            cycleId: cycle.id,
            amount: BigInt(1000000),
            paymentMethod: PaymentMethod.TELEBIRR,
            referenceNumber: `TB-C${c}-${m.id.substring(0, 8).toUpperCase()}`,
            status: ContributionStatus.PAID,
            recordedById: tigist.id,
            recordedAt: dueDate,
          },
        });
      }
    } else if (isCycle3) {
      // In cycle 3 (current): Abebe, Tigist, Chala have paid; Marta is pending
      for (const m of [memAbebe, memTigist, memChala]) {
        await prisma.contribution.create({
          data: {
            membershipId: m.id,
            cycleId: cycle.id,
            amount: BigInt(1000000),
            paymentMethod: PaymentMethod.CBE_BIRR,
            referenceNumber: `CBE-C3-${m.id.substring(0, 8).toUpperCase()}`,
            status: ContributionStatus.PAID,
            recordedById: tigist.id,
            recordedAt: dueDate,
          },
        });
      }
    }
  }

  // Create audit log entry for group creation
  await prisma.auditLog.create({
    data: {
      actorId: abebe.id,
      entityType: "EqubGroup",
      entityId: boleEqub.id,
      action: "SEED_INIT",
      afterState: { name: boleEqub.name, cycles: 4 },
    },
  });

  console.log("Seeding complete! Bole Commercial Merchants Equb successfully provisioned.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
