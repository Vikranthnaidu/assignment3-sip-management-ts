import express from "express";

import {
  createFund,
  getAllFunds,
  updateNAV,
} from "../controller/fundController";

import { verifyInvestor } from "../utils/authManager";

const router = express.Router();

router.post(
  "/createFund",
  verifyInvestor,
  createFund
);

router.get(
  "/getFunds",
  verifyInvestor,
  getAllFunds
);

router.put(
  "/:fundId/nav",
  verifyInvestor,
  updateNAV
);

export default router;