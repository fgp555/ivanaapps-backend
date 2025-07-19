"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const google_routes_1 = __importDefault(require("../auth-google/google.routes"));
const router = (0, express_1.Router)();
router.use("/", auth_routes_1.default);
router.use("/", google_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.routes.js.map