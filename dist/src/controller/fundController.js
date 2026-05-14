"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNAV = exports.getAllFunds = exports.createFund = void 0;
const fundModel = __importStar(require("../models/fundModel"));
const createFund = async (req, res) => {
    try {
        const { id, name, amc_name, current_nav } = req.body;
        const data = {
            id,
            name,
            amc_name,
            current_nav,
        };
        const result = await fundModel.createFund(data);
        return res.status(201).json({
            message: "Fund Created Successfully",
            data: result,
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
};
exports.createFund = createFund;
const getAllFunds = async (req, res) => {
    try {
        const rows = await fundModel.getAllFunds();
        return res.status(200).json(rows);
    }
    catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
};
exports.getAllFunds = getAllFunds;
const updateNAV = async (req, res) => {
    try {
        const fundId = req.params.fundId;
        const { current_nav } = req.body;
        const result = await fundModel.updateNAV(fundId, current_nav);
        if (!result) {
            return res.status(404).json({
                message: "Fund Not Found",
            });
        }
        return res.status(200).json({
            message: "NAV Updated Successfully",
            data: result,
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
};
exports.updateNAV = updateNAV;
