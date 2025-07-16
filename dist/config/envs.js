"use strict";
// src/config/envs.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_ENV = exports.WHATSAPP_VERIFY_TOKEN = exports.ENABLE_FRONTEND = exports.MONGO_URI = exports.GOOGLE_CALLBACK_URL = exports.GOOGLE_CLIENT_SECRET = exports.GOOGLE_CLIENT_ID = exports.CLIENT_URL = exports.PORT = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: ".env" });
exports.PORT = process.env.PORT || 3000;
exports.CLIENT_URL = process.env.CLIENT_URL;
exports.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
exports.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
exports.GOOGLE_CALLBACK_URL = exports.CLIENT_URL + "/api/auth/google/callback";
exports.MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/miapp";
exports.ENABLE_FRONTEND = process.env.ENABLE_FRONTEND ? process.env.ENABLE_FRONTEND === "true" : true;
exports.WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "my_verify_token";
exports.DB_ENV = {
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_PORT: parseInt(process.env.DB_PORT || "3306", 10),
    DB_TYPE: process.env.DB_TYPE || "mysql",
    DB_DATABASE: process.env.DB_DATABASE || "my_db",
    DB_USERNAME: process.env.DB_USERNAME || "root",
    DB_PASSWORD: process.env.DB_TYPE === "mysql" ? process.env.DB_PASSWORD || "" : process.env.DB_PASSWORD,
    SEED_DATA: process.env.SEED_DATA === "true",
    DROPSCHEMA: process.env.DROPSCHEMA === "true",
    SYNCHRONIZE: process.env.SYNCHRONIZE === "true",
    DEV_MODE: process.env.DEV_MODE === "true",
    DB_SSL: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
};
console.info("DB_TYPE: ", exports.DB_ENV.DB_TYPE);
console.info("DB_DATABASE: ", exports.DB_ENV.DB_DATABASE);
console.info("SEED_DATA: ", exports.DB_ENV.SEED_DATA);
console.info("DROPSCHEMA: ", exports.DB_ENV.DROPSCHEMA);
// Verificar si estamos en desarrollo
if (process.env.DEV_MODE === "true") {
    console.log("DEV_MODE: Modo desarrollo");
}
else {
    console.log("DEV_MODE: Modo producción");
}
//# sourceMappingURL=envs.js.map