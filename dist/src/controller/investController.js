"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvestorNetWorth = exports.getInvestorHoldings = exports.getInvestorDetails = exports.logout = exports.createInvestor = exports.login = void 0;
const userModel_1 = require("../models/userModel");
const authManager_1 = require("../utils/authManager");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // FIND USER
        const user = await (0, userModel_1.findUser)(email);
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
        const token = (0, authManager_1.signJwt)({
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
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Server Error",
        });
    }
};
exports.login = login;
const logout = (req, res) => {
    const token = req.headers.authorization;
    const { email } = req.body;
    if (!email || !token) {
        return res.status(400).json({
            message: "Email and Token are required",
        });
    }
    const result = (0, userModel_1.logoutUser)(email, token);
    if (!result) {
        return res.status(400).json({
            message: "Logout Failed",
        });
    }
    return res.status(200).json({
        message: "Logout Successful",
    });
};
exports.logout = logout;
const createInvestor = async (req, res) => {
    try {
        const data = req.body;
        const result = await (0, userModel_1.addInvestor)(data);
        return res.status(201).json({
            message: "Investor Created",
            data: result,
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
};
exports.createInvestor = createInvestor;
const getInvestorDetails = async (req, res) => {
    const id = req.params.id;
    const user = await (0, userModel_1.getUser)(id);
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
exports.getInvestorDetails = getInvestorDetails;
const getInvestorHoldings = async (req, res) => {
    const id = req.params.id;
    const holdings = await (0, userModel_1.getHoldings)(id);
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
exports.getInvestorHoldings = getInvestorHoldings;
const getInvestorNetWorth = async (req, res) => {
    const id = req.params.id;
    const netWorth = await (0, userModel_1.getNetWorth)(id);
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
exports.getInvestorNetWorth = getInvestorNetWorth;
