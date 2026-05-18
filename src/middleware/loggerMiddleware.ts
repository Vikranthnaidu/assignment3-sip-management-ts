import winston from "winston";
import { Request, Response, NextFunction } from "express";

winston.addColors({
    error: "red",
    warn: "yellow",
    info: "green"
});

export const logger = winston.createLogger({

    level: "info",

    format: winston.format.combine(

        winston.format.timestamp(),

        winston.format.printf(
            ({ level, message, timestamp }) => {
                return `${timestamp} [${level.toUpperCase()}] : ${message}`;
            }
        )

    ),

    transports: [

        new winston.transports.Console({

            format: winston.format.combine(
                winston.format.colorize({
                    all: true
                })
            )

        }),

        new winston.transports.File({
            filename: "app.log"
        })

    ]

});

export const logMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    const start = Date.now();

    res.on("finish", () => {

        const duration = Date.now() - start;

        const logMessage =
            `${req.method} ${req.url} ${res.statusCode} - ${duration}ms`;

        if (res.statusCode >= 500) {

            logger.error(logMessage);

        } else if (res.statusCode >= 400) {

            logger.warn(logMessage);

        } else {

            logger.info(logMessage);

        }

    });

    next();
};