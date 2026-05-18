import { Request, Response } from "express";

import {
  findUser,
  getUser,
  getHoldings,
  getNetWorth,
  addInvestor,
  logoutUser,
} from "../models/userModel";

import { signJwt } from "../utils/authManager";

const login = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    // FIND USER
    const user = await findUser(email);

    if (!user) {
      return res.status(404).json({
        error: "Investor Not Found",
      });
    }

    // CHECK PASSWORD
    if (password !== user.password) {
      return res.status(401).json({
        error: "Invalid Password",
      });
    }

    // CREATE JWT TOKEN
    const token = signJwt({
      email: user.email,
      role: user.role,
      investor_id: user.investor_id,
    });

    // STORE TOKEN IN COOKIE
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true only in HTTPS production
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // SUCCESS RESPONSE
    return res.status(200).json({
      success: true,
      message: "Login Success",
      investor_id: user.investor_id,
      token
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      error: "Server Error",
    });

  }
};

const logout = (
  req: Request,
  res: Response
): Response => {

  const token = req.headers.authorization as string;
  const { email } = req.body;

  if (!email || !token) {
    return res.status(400).json({
      message: "Email and Token are required",
    });
  }

  const result = logoutUser(email, token);

  if (!result) {
    return res.status(400).json({
      message: "Logout Failed",
    });
  }

  return res.status(200).json({
    message: "Logout Successful",
  });
};

const createInvestor = async (
  req: Request,
  res: Response
): Promise<Response> => {

  try {

    const data = req.body;

    const result = await addInvestor(data);

    return res.status(201).json({
      message: "Investor Created",
      data: result,
    });

  } catch (err: any) {

    return res.status(500).json({
      error: err.message,
    });

  }
};

const getInvestorDetails = async (
  req: Request,
  res: Response
): Promise<Response> => {

  const id = req.params.id as string;

  const user = await getUser(id);

  if (!user) {
    return res.status(404).json({
      message: "Investor Not Found",
    });
  }

  return res.status(200).json({
    message: "Investor Found",
    data: user,
  });
};

const getInvestorHoldings = async (
  req: Request,
  res: Response
): Promise<Response> => {

  const id = req.params.id as string;

  const holdings = await getHoldings(id);

  if (!holdings) {
    return res.status(404).json({
      message: "No Holdings",
    });
  }

  return res.status(200).json({
    message: "Holdings Found",
    holdings,
  });
};

const getInvestorNetWorth = async (
  req: Request,
  res: Response
): Promise<Response> => {

  const id = req.params.id as string;

  const netWorth = await getNetWorth(id);

  if (!netWorth) {
    return res.status(404).json({
      message: "No Net Worth",
    });
  }

  return res.status(200).json({
    message: "Net Worth Calculated",
    netWorth,
  });
};

export {
  login,
  createInvestor,
  logout,
  getInvestorDetails,
  getInvestorHoldings,
  getInvestorNetWorth,
};