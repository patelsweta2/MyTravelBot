import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";

dotenv.config();
connectDB();

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

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
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:30001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

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

// server.listen(5000, () => {
//   console.log("Server running at https://localhost:5000");
// });
