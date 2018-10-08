import { injectable } from "inversify";

enum LogLevel {
    Fatal = "fatal",
    Error = "error",
    Warn = "warn",
    Info = "info",
    Debug = "debug",
    Trace = "trace",
}

interface ILogger {
    fatal(message: string, object?: object): void;
    error(message: string, object?: object): void;
    warn(message: string, object?: object): void;
    info(message: string, object?: object): void;
    debug(message: string, object?: object): void;
    trace(message: string, object?: object): void;
}

@injectable()
export class LoggerService implements ILogger {
    constructor(
        private readonly className?: string
    ) {
    }

    fatal(message: string, object?: object): void {
        return this.log(LogLevel.Fatal, message, object);
    }
    error(message: string, object?: object): void {
        return this.log(LogLevel.Error, message, object);
    }
    warn(message: string, object?: object): void {
        return this.log(LogLevel.Warn, message, object);
    }
    info(message: string, object?: object): void {
        return this.log(LogLevel.Info, message, object);
    }
    debug(message: string, object?: object): void {
        return this.log(LogLevel.Debug, message, object);
    }
    trace(message: string, object?: object): void {
        return this.log(LogLevel.Trace, message, object);
    }

    private log(level: LogLevel, message: string, object?: object): void {
        const prefix = this.className ? (this.className + " - ") : "";
        switch (level) {
            case LogLevel.Debug:
                return object !== undefined ? console.debug(`[${level}] ${prefix}${message}`, object) : console.debug(`[${level}] ${prefix}${message}`);
            case LogLevel.Error:
                return object !== undefined ? console.error(`[${level}] ${prefix}${message}`, object) : console.error(`[${level}] ${prefix}${message}`);
            case LogLevel.Fatal:
                return object !== undefined ? console.error(`[${level}] ${prefix}${message}`, object) : console.error(`[${level}] ${prefix}${message}`);
            case LogLevel.Info:
                return object !== undefined ? console.info(`[${level}] ${prefix}${message}`, object) : console.info(`[${level}] ${prefix}${message}`);
            case LogLevel.Trace:
                return object !== undefined ? console.debug(`[${level}] ${prefix}${message}`, object) : console.debug(`[${level}] ${prefix}${message}`);
            case LogLevel.Warn:
                return object !== undefined ? console.warn(`[${level}] ${prefix}${message}`, object) : console.warn(`[${level}] ${prefix}${message}`);
            default:
                break;
        }
    }
}
