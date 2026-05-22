import winston from "winston";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Recreate __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === "production";

// Ensure logs directory exists (only in dev)
const logDir = path.join(__dirname, "logs");
if (!isProduction && !fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${stack || message}`;
    }),
  ),
  transports: isProduction
    ? [new winston.transports.Console({ level: "info" })]
    : [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: path.join(logDir, "app.log"),
        }),
        new winston.transports.File({
          filename: path.join(logDir, "error.log"),
          level: "error",
        }),
      ],
});

export default logger;
