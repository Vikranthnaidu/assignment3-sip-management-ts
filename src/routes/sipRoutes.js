import express from "express";

import {
  createSip,
  getSipById,
  processSip,
  getSipTransactions,
  getTransactions,
} from "../controller/sipController";

import { verifyInvestor } from "../utils/authManager";

const router = express.Router();

router.post(
  "/createSip",
  verifyInvestor,
  createSip
);

router.get(
  "/:sipId",
  verifyInvestor,
  getSipById
);

router.post(
  "/:sipId/process",
  verifyInvestor,
  processSip
);

router.get(
  "/:sipId/transactions",
  verifyInvestor,
  getSipTransactions
);

router.get(
  "/trans/:investorId/transactions",
  verifyInvestor,
  getTransactions
);

export default router;