import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/db";
import { RegisterSchema, LoginSchema, SystemRole } from "@ethioequb/shared";
import { ConflictError, UnauthorizedError } from "../utils/errors";
import { generateToken, setSessionCookie, clearSessionCookie } from "../middleware/auth";
import { logAuditAction } from "../services/audit.service";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const input = RegisterSchema.parse(req.body);

      // Check existing email
      const existing = await prisma.user.findUnique({
        where: { email: input.email },
      });
      if (existing) {
        throw new ConflictError("An account with this email address already exists");
      }

      const passwordHash = await bcrypt.hash(input.password, 12);

      const user = await prisma.user.create({
        data: {
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          passwordHash,
          systemRole: SystemRole.USER,
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          systemRole: true,
          createdAt: true,
        },
      });

      const token = generateToken({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        systemRole: user.systemRole as SystemRole,
      });

      setSessionCookie(res, token);

      await logAuditAction({
        actorId: user.id,
        entityType: "User",
        entityId: user.id,
        action: "REGISTER",
        afterState: { email: user.email, fullName: user.fullName },
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });

      return res.status(201).json({
        success: true,
        data: { user, token },
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const input = LoginSchema.parse(req.body);

      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedError("Invalid email or password");
      }

      const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
      if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid email or password");
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        systemRole: user.systemRole as SystemRole,
      });

      setSessionCookie(res, token);

      await logAuditAction({
        actorId: user.id,
        entityType: "User",
        entityId: user.id,
        action: "LOGIN",
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });

      return res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            systemRole: user.systemRole,
          },
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        await logAuditAction({
          actorId: req.user.id,
          entityType: "User",
          entityId: req.user.id,
          action: "LOGOUT",
          ipAddress: req.ip,
          userAgent: req.get("user-agent"),
        });
      }

      clearSessionCookie(res);

      return res.status(200).json({
        success: true,
        data: { message: "Successfully logged out" },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          systemRole: true,
          createdAt: true,
          memberships: {
            include: {
              group: {
                select: {
                  id: true,
                  name: true,
                  status: true,
                  frequency: true,
                  contributionAmount: true,
                  totalCycles: true,
                },
              },
            },
          },
        },
      });

      return res.status(200).json({
        success: true,
        data: {
          user: user
            ? {
                ...user,
                memberships: user.memberships.map((m) => ({
                  ...m,
                  group: {
                    ...m.group,
                    contributionAmount: m.group.contributionAmount.toString(),
                  },
                })),
              }
            : null,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
