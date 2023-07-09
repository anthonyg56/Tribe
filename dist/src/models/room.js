"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const RoomSchema = new mongoose_1.Schema({
    users: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
            validate: {
                validator: function (val) {
                    return val.length <= 2;
                },
                message: 'There cannot be more than two users in a room'
            }
        }],
    tribeID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Tribe',
    },
    messages: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Chat'
        }],
    createdAt: {
        type: String,
        required: true,
        default: new Date().toISOString(),
    }
});
const Room = mongoose_1.default.model('Room', RoomSchema);
exports.default = Room;
//# sourceMappingURL=room.js.map