import { prisma } from "../config/db";
import { Prisma } from "@prisma/client";

interface AuditLogParams {
  actorId?: string;
  entityType: string;
  entityId: string;
  action: string;
  beforeState?: unknown;
  afterState?: unknown;
  ipAddress?: string;
  userAgent?: string;
  tx?: Prisma.TransactionClient;
}

export async function logAuditAction(params: AuditLogParams) {
  const client = params.tx || prisma;

  try {
    return await client.auditLog.create({
      data: {
        actorId: params.actorId || null,
        entityType: params.entityType,
        entityId: params.entityId,
        action: params.action,
        beforeState: params.beforeState ? JSON.parse(JSON.stringify(params.beforeState)) : undefined,
        afterState: params.afterState ? JSON.parse(JSON.stringify(params.afterState)) : undefined,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent || null,
      },
    });
  } catch (error) {
    // Audit logging failure should not silently pass; log error to stdout
    console.error("[CRITICAL AUDIT LOGGING ERROR]:", error);
    throw error;
  }
}
