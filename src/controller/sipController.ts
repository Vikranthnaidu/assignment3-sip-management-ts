import { Request, Response } from "express";

import {
  addSip,
  fetchSipById,
  executeSip,
  fetchSipTransactions,
} from "../models/sipModel";

import client from "../utils/pgManager";

const createSip = async (
  req: Request,
  res: Response
): Promise<Response> => {

  try {

    const data = req.body;

    const result = await addSip(data);

    return res.status(201).json({
      message: "SIP Created",
      sip: result,
    });

  } catch (err: any) {

    return res.status(500).json({
      error: err.message,
    });

  }
};

const getTransactions = async (
  req: Request,
  res: Response
): Promise<Response> => {

  try {

    const investorId = req.params.investorId as string;

    const query = `
      SELECT
          th.transaction_id,
          th.sip_id,
          th.transaction_type,
          th.amount,
          th.nav,
          th.units,
          th.transaction_date,
          mf.name AS fund_name

      FROM transaction_history th

      JOIN sip s
          ON th.sip_id = s.id

      JOIN portfolio p
          ON s.portfolio_id = p.portfolio_id

      JOIN mf_details mf
          ON th.mutual_id = mf.id

      WHERE p.investor_id = $1

      ORDER BY th.transaction_date DESC
    `;

    const result = await client.query(query, [investorId]);

    return res.status(200).json({
      transactions: result.rows,
    });

  } catch (error: any) {

    console.log(error);

    return res.status(500).json({
      error: error.message,
    });

  }
};

const getSipById = async (
  req: Request,
  res: Response
): Promise<Response> => {

  try {

    const sipId = req.params.sipId as string;

    const sip = await fetchSipById(sipId);

    if (!sip) {
      return res.status(404).json({
        error: "SIP Not Found",
      });
    }

    return res.status(200).json({
      message: "SIP Found",
      sip,
    });

  } catch (err: any) {

    return res.status(500).json({
      error: err.message,
    });

  }
};

const processSip = async (
  req: Request,
  res: Response
): Promise<Response> => {

  try {

    const sipId = req.params.sipId as string;

    const result = await executeSip(sipId);

    return res.status(200).json({
      message: "SIP Processed Successfully",
      transaction: result,
    });

  } catch (err: any) {

    return res.status(500).json({
      error: err.message,
    });

  }
};

const getSipTransactions = async (
  req: Request,
  res: Response
): Promise<Response> => {

  try {

    const sipId = req.params.sipId as string;

    const transactions = await fetchSipTransactions(sipId);

    if (transactions.length === 0) {
      return res.status(404).json({
        error: "No Transactions Found",
      });
    }

    return res.status(200).json({
      message: "Transactions Found",
      transactions,
    });

  } catch (err: any) {

    return res.status(500).json({
      error: err.message,
    });

  }
};

export {
  createSip,
  getSipById,
  processSip,
  getSipTransactions,
  getTransactions,
};