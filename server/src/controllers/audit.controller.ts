import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";

export class AuditController {
  static async listLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 20;
      const entityType = req.query.entityType as string;

      const where: any = {};
      if (entityType) where.entityType = entityType;

      const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
          where,
          include: { actor: { select: { fullName: true, email: true } } },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.auditLog.count({ where }),
      ]);

      return res.status(200).json({
        success: true,
        data: { logs },
        meta: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
