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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importStar(require("../auth-user/models/user.model"));
const email_service_1 = require("../mail/email.service");
const ACCESS_SECRET_EXPIRES = "3d";
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "access-secret";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh-secret";
class AuthService {
    constructor() {
        this.emailService = new email_service_1.EmailService();
    }
    async register(body) {
        const existing = await user_model_1.default.findOne({ email: body.email });
        if (existing)
            throw new Error("Email already registered");
        const hashed = await bcrypt_1.default.hash(body.password, 10);
        const newUser = new user_model_1.default({ ...body, password: hashed });
        return await newUser.save();
    }
    async login(body) {
        const { email, password } = body;
        const user = await user_model_1.default.findOne({ email }).select("+password");
        if (!user)
            return null;
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password || "");
        if (!isPasswordValid)
            return null;
        const userRoles = user.role === user_model_1.UserRole.SUPERADMIN
            ? [user_model_1.UserRole.SUPERADMIN]
            : user.role === user_model_1.UserRole.ADMIN
                ? [user_model_1.UserRole.ADMIN]
                : user.role === user_model_1.UserRole.COLLABORATOR
                    ? [user_model_1.UserRole.COLLABORATOR]
                    : [user_model_1.UserRole.USER];
        const userPayload = {
            sub: user._id,
            userId: user._id,
            email: user.email,
            roles: userRoles,
        };
        const tokens = this.generateTokens(userPayload);
        const decodedAccess = jsonwebtoken_1.default.decode(tokens.accessToken);
        const loginDate = new Date().toLocaleString();
        const expirationDate = decodedAccess?.exp ? new Date(decodedAccess.exp * 1000).toLocaleString() : null;
        const { password: _, ...userData } = user.toObject();
        return {
            login: true,
            user: {
                ...userData,
            },
            loginDate,
            expirationDate,
            currentDate: new Date().toLocaleString(),
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }
    decodeToken(token) {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded)
            return null;
        const createdDate = decoded.iat ? new Date(decoded.iat * 1000) : null;
        const expirationDate = decoded.exp ? new Date(decoded.exp * 1000) : null;
        const currentDate = new Date();
        let status = "unknown";
        if (expirationDate) {
            status = expirationDate > currentDate ? "active" : "expired";
        }
        return {
            ...decoded,
            status,
            tokenType: decoded.tokenType || "unknown",
            createdDate: createdDate?.toLocaleString() || null,
            expirationDate: expirationDate?.toLocaleString() || null,
            currentDate: currentDate.toLocaleString(),
        };
    }
    generateTokens(payload) {
        const accessPayload = { ...payload, tokenType: "access" };
        const refreshPayload = { ...payload, tokenType: "refresh" };
        const accessToken = jsonwebtoken_1.default.sign(accessPayload, ACCESS_SECRET, { expiresIn: ACCESS_SECRET_EXPIRES });
        const refreshToken = jsonwebtoken_1.default.sign(refreshPayload, REFRESH_SECRET, { expiresIn: "7d" });
        return { accessToken, refreshToken };
    }
    verifyRefreshToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, REFRESH_SECRET);
        }
        catch {
            return null;
        }
    }
    async forgotPassword(email, baseURL) {
        const user = await user_model_1.default.findOne({ email });
        if (!user)
            throw new Error("Email not found");
        const tokenPayload = {
            email: user.email,
            userId: user._id,
            tokenType: "reset",
        };
        const resetToken = jsonwebtoken_1.default.sign(tokenPayload, ACCESS_SECRET, {
            expiresIn: "15m", // ✅ válido por 5 minutos
        });
        const resetLink = `${baseURL}/reset-password?token=${resetToken}`;
        await this.emailService.sendResetPasswordEmail(email, resetLink);
        return resetToken;
    }
    async restorePassword(resetToken, newPassword) {
        try {
            const decoded = jsonwebtoken_1.default.verify(resetToken, ACCESS_SECRET);
            if (!decoded || decoded.tokenType !== "reset")
                throw new Error("Invalid token");
            const user = await user_model_1.default.findById(decoded.userId);
            if (!user)
                throw new Error("User not found");
            const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();
            return true;
        }
        catch {
            return false;
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map