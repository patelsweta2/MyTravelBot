import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.js";
import { createClient } from "redis";
import cookieParser from "cookie-parser";

dotenv.config();
await connectDB();

const app = express();

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  console.log("Missing redisUrl");
  process.exit(1);
}

export const redisClient = createClient({
  url: redisUrl,
});
redisClient
  .connect()
  .then(() => console.log("connected to redis"))
  .catch((err) => console.error);

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use("/api/V1", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});

// http server
// import http from "http";

// const server = http.createServer((req, res) => {
//   if (req.url === "/" && req.method === "GET") {
//     res.writeHead(200, { "Content-Type": "text/plain" });
//     res.end("Hello World! (from raw Node.js HTTP");
//   } else {
//     res.writeHead(404);
//     res.end("Not found");
//   }
// });

//specific origin code
// const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, type);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//   })
// );

// another method
// app.use(
//   cors({
//     origin: ["http://localhost:3000", "http://localhost:30001"],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

// server.listen(5000, () => {
//   console.log("Server running at https://localhost:5000");
// });
