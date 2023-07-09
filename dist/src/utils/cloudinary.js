"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const cloudinary_1 = require("cloudinary");
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "";
const apiKey = process.env.CLOUDINARY_API_KEY || "";
const apiSecret = process.env.CLOUDINARY_API_SECRET || "";
cloudinary_1.v2.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
});
exports.default = cloudinary_1.v2;
//# sourceMappingURL=cloudinary.js.map