import winston from "winston";
import path from "path";

const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white",
};
winston.addColors(colors);

const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    winston.format.printf(
        (info) => `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message}`
    )
);

export const logger = winston.createLogger({
    // 'info' catches info, warn, and error. 
    level: "info",
    transports: [
        // Output critical errors to an isolated error tracking file
        new winston.transports.File({
            filename: path.join("logs", "error.log"),
            level: "error",
            format: winston.format.combine(winston.format.uncolorize(), logFormat),
        }),
        // Output all general application info/warnings to a unified file
        new winston.transports.File({
            filename: path.join("logs", "combined.log"),
            format: winston.format.combine(winston.format.uncolorize(), logFormat),
        }),
        // Keep logs active in the standard terminal terminal console with colors enabled
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                logFormat
            ),
        }),
    ],
});
