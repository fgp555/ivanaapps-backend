"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = process.env.JWT_SECRET || "secret123";
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ message: "No token provided" });
    const token = authHeader.split(" ")[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.user = payload;
        next();
    }
    catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
}
//# sourceMappingURL=auth.middleware.js.map