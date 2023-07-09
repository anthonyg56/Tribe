require("dotenv").config();

import express, { Application } from "express";
import mongoose, { ConnectOptions } from "mongoose";
import Session from 'express-session'
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

import passport from "./utils/passport";
import EngineIO from './utils/socketio';
import AuthRouter from "./routes/auth.routes";
import UserRouter from "./routes/user.routes";
import TribeRouter from "./routes/tribe.routes";
import PostRouter from "./routes/post.routes";
import InviteRouter from "./routes/invite.routes";
import CommentRouter from "./routes/comment.routes";
// import ChatRouter from './routes/chat.routes';
import NotificationRouter from "./routes/notification.routes";

const port = process.env.PORT || 5000;
const uri = process.env.DB_URI as string || "";
const sessionKey = process.env.SESSION_SECRET as string || "";
const app: Application = express();

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: {
  origin: 'http://localhost:3000',
  credentials: true,
}});

app.set('socket.io', io)

mongoose.set('strictQuery', false)
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => {
    return console.log(`Successfully connected to database`);
  })
  .catch((error) => {
    console.log("Error connecting to database: ", error);
    return process.exit(1);
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    methods: "PUT, POST, DELETE, GET",
    
  })
);
app.use(cors({
  origin: "https://tribe-next-js.vercel.app",
    credentials: true,
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    methods: "PUT, POST, DELETE, GET",
}));

app.use((req, res, next) => {
  if (req.cookies) {
    const token = req.cookies.accessToken;
    req.headers.authorization = `Bearer ${token}`;
  }
  next();
});

app.use(Session({
  secret: sessionKey,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use("/auth", AuthRouter);
app.use(
  "/user",
  passport.authenticate("jwt", { session: false }),
  UserRouter
);
app.use(
  "/tribe",
  // passport.authenticate("jwt", { session: false }),
  TribeRouter
);
app.use(
  "/post",
  passport.authenticate("jwt", { session: false }),
  PostRouter
);
app.use(
  "/invite",
  passport.authenticate("jwt", { session: false }),
  InviteRouter
);
app.use(
  "/comment",
  passport.authenticate("jwt", { session: false }),
  CommentRouter
);
// app.use(
//   "/chat",
//   passport.authenticate("jwt", { session: false }),
//   ChatRouter
// )
app.use(
  "/notification",
  passport.authenticate("jwt", { session: false }),
  NotificationRouter
)

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
