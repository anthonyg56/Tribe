"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
exports.default = () => (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        filename: (req, file, cb) => {
            cb(null, `${file.fieldname}-${Date.now()}${path_1.default.extname(file.originalname)}`);
        },
        destination: (req, file, cb) => {
            cb(null, './uploads');
        },
    }),
    fileFilter: (req, file, cb) => {
        let ext = path_1.default.extname(file.originalname);
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
            return cb(new Error("File type is not supported"));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});
//# sourceMappingURL=multer.js.map