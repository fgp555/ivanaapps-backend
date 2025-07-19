"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedUser = void 0;
// src/seed/user/user.seed.ts
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_entity_1 = require("../../../module/auth-user/dtos-entities/user.entity"); // solo para el enum
const user_model_1 = __importDefault(require("../../../module/auth-user/models/user.model")); // tu modelo Mongoose
const seedUser = async () => {
    try {
        const hashedPass = async (password) => await bcrypt_1.default.hash(password, 10);
        const users = [
            {
                name: "SUPERADMIN",
                email: process.env.ADMIN_MAIL,
                password: await hashedPass(process.env.ADMIN_PASS || "admin123"),
                role: user_entity_1.UserRole.SUPERADMIN,
                photo: "https://i.postimg.cc/GmddyvS1/icon-user.webp",
                sendMail: false,
                isVisible: true,
            },
            {
                name: "User Tester",
                email: "user@gmail.com",
                password: await hashedPass("user@gmail.com"),
                role: user_entity_1.UserRole.USER,
            },
            {
                name: "Admin Tester",
                email: "admin@gmail.com",
                password: await hashedPass("admin@gmail.com"),
                role: user_entity_1.UserRole.ADMIN,
            },
        ];
        for (const user of users) {
            const exists = await user_model_1.default.findOne({ email: user.email });
            if (!exists) {
                await user_model_1.default.create(user);
                console.log(`✅ Seeded: ${user.email}`);
            }
            else {
                console.log(`ℹ️ Already exists: ${user.email}`);
            }
        }
        console.log("🎉 User seeding completed");
    }
    catch (error) {
        console.error("❌ Error seeding users:", error);
    }
};
exports.seedUser = seedUser;
//# sourceMappingURL=user.seeder.js.map