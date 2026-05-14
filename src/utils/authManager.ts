import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const secret = "asdfghjkledcrfvtghn";

interface CustomJwtPayload extends JwtPayload {
  email: string;
  role: string;
  investor_id: string;
}

interface AuthRequest extends Request {
  user?: CustomJwtPayload;
}

const signJwt = (
  payload: object
): string | undefined => {

  try {

    const token = jwt.sign(payload, secret, {
      expiresIn: "30m",
    });

    return token;

  } catch (error) {

    console.log(error);

  }
};

const verifyInvestor = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Response | void => {

  try {

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        error: "Token Required",
      });
    }

    const decoded = jwt.verify(
      token,
      secret
    ) as CustomJwtPayload;

    if (decoded.role !== "investor") {
      return res.status(403).json({
        error: "Access Denied",
      });
    }

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      error: "Invalid Token",
    });

  }
};

export {
  signJwt,
  verifyInvestor,
  AuthRequest,
};