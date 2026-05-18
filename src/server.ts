// import express, { Application } from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// import client from "./utils/pgManager";

// import investRoutes from "./routes/investRoutes";
// import fundRoutes from "./routes/fundRoutes";
// import sipRoutes from "./routes/sipRoutes";
// import { logMiddleware } from "./middleware/loggerMiddleware";
// import "./middleware/telemetry";

// const app: Application = express();

// app.use(express.json());
// app.use(logMiddleware);
// app.use(cookieParser());

// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "http://localhost:3001",
//       "http://localhost:8081",
//       "http://localhost:8082",
//       "http://localhost:19006",
//     ],
//     credentials: true,
//   })
// );

// app.use("/sip/invest", investRoutes);

// app.use("/sip/fund", fundRoutes);

// app.use("/sip", sipRoutes);

// app.listen(4000, () => {
//   console.log("Server started on port 4000");
// });

import express, {
    Request,
    Response,
    NextFunction
} from "express";

import cors from "cors";

import investRoutes from "./routes/investRoutes";
import fundRoutes from "./routes/fundRoutes";
import sipRoutes from "./routes/sipRoutes";

import { logMiddleware }
from "./middleware/loggerMiddleware";

import tracer from "./middleware/telemetry";

export const app = express();

app.use(express.json());

app.use(logMiddleware);

app.use(
    cors({
        origin: "http://localhost:3000"
    })
);

function middleware(
    request: Request,
    response: Response,
    next: NextFunction
): void {

    const span = tracer.startSpan(
        "Authorization tracer"
    );

    const { authorization } = request.headers;

    span.setAttribute(
        "user.token",
        authorization || "No Token"
    );

    if (authorization) {

        span.setAttribute(
            "user.tokenPassed",
            true
        );

        try {

            span.setStatus({
                code: 1
            });

            next();

        } catch (e: any) {

            span.recordException(e);

            response
                .status(401)
                .send("Invalid token");

        } finally {

            span.end();

        }

    } else {

        span.setAttribute(
            "user.tokenPassed",
            false
        );

        response
            .status(401)
            .send("Authorization token missing");

        span.end();
    }
}

app.use(middleware);

app.use(
    "/sip/invest",
    investRoutes
);

app.use(
    "/sip/fund",
    fundRoutes
);

app.use(
    "/sip",
    sipRoutes
);

const PORT: number = 4000;

app.listen(PORT, () => {

    console.log(
        `Server started on port ${PORT}`
    );

});