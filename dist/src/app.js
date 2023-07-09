"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const passport_1 = __importDefault(require("./utils/passport"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const tribe_routes_1 = __importDefault(require("./routes/tribe.routes"));
const post_routes_1 = __importDefault(require("./routes/post.routes"));
const invite_routes_1 = __importDefault(require("./routes/invite.routes"));
const comment_routes_1 = __importDefault(require("./routes/comment.routes"));
// import ChatRouter from './routes/chat.routes';
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const port = process.env.PORT || 5000;
const uri = process.env.DB_URI || "";
const sessionKey = process.env.SESSION_SECRET || "";
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, { cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    } });
app.set('socket.io', io);
mongoose_1.default.set('strictQuery', false);
mongoose_1.default
    .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
    return console.log(`Successfully connected to database`);
})
    .catch((error) => {
    console.log("Error connecting to database: ", error);
    return process.exit(1);
});
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    methods: "PUT, POST, DELETE, GET",
}));
app.use((0, cors_1.default)({
    origin: "https://tribe-next-js.vercel.app",
    credentials: true,
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    methods: "PUT, POST, DELETE, GET",
}));
app.use((req, res, next) => {
    if (req.cookies) {
        const token = req.cookies.accessToken;
        req.headers.authorization = `Bearer ${token}`;
    }
    next();
});
app.use((0, express_session_1.default)({
    secret: sessionKey,
    resave: false,
    saveUninitialized: false
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
/* Routes */
app.use("/auth", auth_routes_1.default);
app.use("/user", passport_1.default.authenticate("jwt", { session: false }), user_routes_1.default);
app.use("/tribe", 
// passport.authenticate("jwt", { session: false }),
tribe_routes_1.default);
app.use("/post", passport_1.default.authenticate("jwt", { session: false }), post_routes_1.default);
app.use("/invite", passport_1.default.authenticate("jwt", { session: false }), invite_routes_1.default);
app.use("/comment", passport_1.default.authenticate("jwt", { session: false }), comment_routes_1.default);
// app.use(
//   "/chat",
//   passport.authenticate("jwt", { session: false }),
//   ChatRouter
// )
app.use("/notification", passport_1.default.authenticate("jwt", { session: false }), notification_routes_1.default);
app.get("/", (req, res, next) => {
    res.send("Hello World");
});
/**
 * Socket.io Engine
 *
 * learn more: https://socket.io/docs/v4/server-instance/
 */
// EngineIO(io)
httpServer.listen(port, () => {
    console.log(`Server running on ${port}`);
});
//# sourceMappingURL=app.js.map