import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import client from "./utils/pgManager";

import investRoutes from "./routes/investRoutes";
import fundRoutes from "./routes/fundRoutes";
import sipRoutes from "./routes/sipRoutes";

const app: Application = express();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
  })
);

app.use("/sip/invest", investRoutes);

app.use("/sip/fund", fundRoutes);

app.use("/sip", sipRoutes);

app.listen(4000, () => {
  console.log("Server started on port 4000");
});