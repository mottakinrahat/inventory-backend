
import { Secret, JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../../helpers/jwtHelpers";

import { NextFunction, Request, Response } from "express";
import config from "../../config";

export const auth = (...roles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      let token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({
            success: false,
            message: "You are not authorized",
        });
      }
      if(token.startsWith("Bearer ")){
        token = token.split(" ")[1];
      }
      
      const verifiedUser = await verifyToken(token as string, config.jwt.jwt_secret as Secret);
      req.user = verifiedUser as JwtPayload & { email: string; role: string; };
      
      if (roles.length && !roles.includes(verifiedUser.role)) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized for this role",
        });
      }
        next();
    } catch (error) {
      next(error);
    }
  };
};