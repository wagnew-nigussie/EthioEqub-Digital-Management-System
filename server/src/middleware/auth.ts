import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError, ForbiddenError } from "../utils/errors";
import { prisma } from "../config/db";
import { GroupRole, SystemRole } from "@ethioequb/shared";

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  systemRole: SystemRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "ethioequb_development_jwt_secret_key_default";
const COOKIE_NAME = process.env.COOKIE_NAME || "ethioequb_session";

export function generateToken(payload: AuthenticatedUser): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function setSessionCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  let token = req.cookies?.[COOKIE_NAME];

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new UnauthorizedError("Authentication token required"));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    return next(new UnauthorizedError("Invalid or expired session"));
  }
}

export function requireSystemAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    return next(new UnauthorizedError());
  }
  if (req.user.systemRole !== SystemRole.ADMIN) {
    return next(new ForbiddenError("Platform administrative privileges required"));
  }
  next();
}

/**
 * Enforces role-based permissions within a specific Equb Group.
 */
export function requireGroupRole(allowedRoles: GroupRole[]) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new UnauthorizedError());

    // Platform admin bypasses group role restrictions
    if (req.user.systemRole === SystemRole.ADMIN) return next();

    const groupId = req.params.groupId || req.params.id;
    if (!groupId) return next(new ForbiddenError("Group ID required in request path"));

    try {
      const membership = await prisma.membership.findUnique({
        where: {
          userId_groupId: {
            userId: req.user.id,
            groupId,
          },
        },
      });

      if (!membership || membership.status !== "ACTIVE") {
        return next(new ForbiddenError("You are not an active member of this Equb group"));
      }

      if (!allowedRoles.includes(membership.roleInGroup as GroupRole)) {
        return next(
          new ForbiddenError(
            `Access restricted. Requires one of: ${allowedRoles.join(", ")}. Your role: ${membership.roleInGroup}`
          )
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
