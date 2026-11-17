import "server-only";
import { prisma } from "@/lib/db";

export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "LOGIN";
export type AuditEntity = "PRODUCT" | "USER";

export interface AuditLogInput {
  userId: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId?: string;
  details?: string;
}

export async function createAuditLog(input: AuditLogInput): Promise<void> {
  await prisma.auditLog.create({
    data: {
      userId: input.userId,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId ?? null,
      details: input.details ?? null,
    },
  });
}
