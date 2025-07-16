"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wardrobe_controller_1 = require("./wardrobe.controller");
const router = (0, express_1.Router)();
const controller = new wardrobe_controller_1.WardrobeController();
router.get("/getAll", controller.getAll.bind(controller));
exports.default = router;
//# sourceMappingURL=wardrobe.routes.js.map