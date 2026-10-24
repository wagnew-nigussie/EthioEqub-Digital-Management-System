import { z } from "zod";

// ==============================================================================
// 1. DOMAIN ENUMS & CONSTANTS
// ==============================================================================

export enum SystemRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum GroupRole {
  OWNER = "OWNER",
  TREASURER = "TREASURER",
  MANAGER = "MANAGER",
  MEMBER = "MEMBER",
}

export enum GroupFrequency {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
}

export enum PayoutRule {
  JOIN_ORDER = "JOIN_ORDER",
  LOTTERY = "LOTTERY",
  AUCTION = "AUCTION",
}

export enum GroupStatus {
  ACTIVE = "ACTIVE",
  FROZEN = "FROZEN",
  COMPLETED = "COMPLETED",
}

export enum CycleStatus {
  PENDING = "PENDING",
  OPEN = "OPEN",
  RECONCILED = "RECONCILED",
  CLOSED = "CLOSED",
}

export enum PaymentMethod {
  CASH = "CASH",
  TELEBIRR = "TELEBIRR",
  CBE_BIRR = "CBE_BIRR",
  BANK_TRANSFER = "BANK_TRANSFER",
  OTHER = "OTHER",
}

export enum ContributionStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  PARTIAL = "PARTIAL",
  LATE = "LATE",
  DISPUTED = "DISPUTED",
  ADJUSTED = "ADJUSTED",
}

export enum PayoutStatus {
  SCHEDULED = "SCHEDULED",
  PENDING_SECOND_APPROVAL = "PENDING_SECOND_APPROVAL",
  APPROVED = "APPROVED",
  DISBURSED = "DISBURSED",
}

export enum DisputeStatus {
  OPEN = "OPEN",
  UNDER_REVIEW = "UNDER_REVIEW",
  RESOLVED = "RESOLVED",
  REJECTED = "REJECTED",
}

// ==============================================================================
// 2. FINANCIAL ARITHMETIC UTILITIES (BR-001)
// ==============================================================================

/**
 * Converts ETB (major unit) to Santim (minor integer unit).
 * Example: 100.50 ETB -> 10050 Santim
 */
export function toMinorUnits(etbAmount: number): number {
  return Math.round(etbAmount * 100);
}

/**
 * Converts Santim (minor integer unit) to ETB (major unit).
 * Example: 10050 Santim -> 100.50 ETB
 */
export function toMajorUnits(minorUnits: number | bigint): number {
  return Number(minorUnits) / 100;
}

/**
 * Formats minor units into an Ethiopian Birr currency string.
 * Example: 1000000 Santim -> "10,000.00 ETB"
 */
export function formatETB(minorUnits: number | bigint): string {
  const amount = toMajorUnits(minorUnits);
  return `${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB`;
}

// ==============================================================================
// 3. ZOD VALIDATION SCHEMAS & DTOS
// ==============================================================================

export const RegisterSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Valid email address is required").toLowerCase().trim(),
  phone: z.string().min(9, "Phone number must be at least 9 digits").max(20).trim(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email("Valid email address is required").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const CreateGroupSchema = z.object({
  name: z.string().min(3, "Group name must be at least 3 characters").max(100).trim(),
  description: z.string().max(500).optional(),
  contributionAmountETB: z.number().positive("Contribution amount must be greater than zero"),
  currency: z.string().default("ETB"),
  frequency: z.nativeEnum(GroupFrequency),
  totalCycles: z.number().int().min(2, "Equb requires at least 2 members/cycles").max(100),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Valid start date is required",
  }),
  payoutRule: z.nativeEnum(PayoutRule).default(PayoutRule.JOIN_ORDER),
  requireGuarantor: z.boolean().default(false),
  allowSingleApproverIfSmall: z.boolean().default(true),
});
export type CreateGroupInput = z.infer<typeof CreateGroupSchema>;

export const AddMemberSchema = z.object({
  userId: z.string().uuid("Valid user ID required"),
  roleInGroup: z.nativeEnum(GroupRole).default(GroupRole.MEMBER),
  payoutPosition: z.number().int().positive().optional(),
  guarantorName: z.string().max(100).optional(),
  guarantorPhone: z.string().max(20).optional(),
});
export type AddMemberInput = z.infer<typeof AddMemberSchema>;

export const RecordContributionSchema = z.object({
  membershipId: z.string().uuid("Valid membership ID required"),
  cycleId: z.string().uuid("Valid cycle ID required"),
  amountETB: z.number().positive("Amount must be a positive number"),
  paymentMethod: z.nativeEnum(PaymentMethod),
  referenceNumber: z.string().max(100).optional().nullable(),
  note: z.string().max(300).optional(),
});
export type RecordContributionInput = z.infer<typeof RecordContributionSchema>;

export const CreateAdjustmentSchema = z.object({
  contributionId: z.string().uuid("Valid contribution ID required"),
  amountDeltaETB: z.number().refine((val) => val !== 0, {
    message: "Adjustment delta cannot be zero",
  }),
  reason: z.string().min(5, "A clear reason of at least 5 characters is required for adjustments").max(500),
});
export type CreateAdjustmentInput = z.infer<typeof CreateAdjustmentSchema>;

export const ApprovePayoutSchema = z.object({
  notes: z.string().max(300).optional(),
});
export type ApprovePayoutInput = z.infer<typeof ApprovePayoutSchema>;

export const RaiseDisputeSchema = z.object({
  contributionId: z.string().uuid("Valid contribution ID required"),
  reason: z.string().min(5, "Detailed explanation of dispute is required").max(500),
});
export type RaiseDisputeInput = z.infer<typeof RaiseDisputeSchema>;

export const ResolveDisputeSchema = z.object({
  status: z.enum([DisputeStatus.RESOLVED, DisputeStatus.REJECTED]),
  resolutionNotes: z.string().min(5, "Resolution findings must be explained").max(500),
  adjustmentDeltaETB: z.number().optional(),
});
export type ResolveDisputeInput = z.infer<typeof ResolveDisputeSchema>;
