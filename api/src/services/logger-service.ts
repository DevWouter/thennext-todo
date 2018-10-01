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
        switch (level) {
            case LogLevel.Debug:
                return object !== undefined ? console.debug(message, object) : console.debug(message);
            case LogLevel.Error:
                return object !== undefined ? console.error(message, object) : console.error(message);
            case LogLevel.Fatal:
                return object !== undefined ? console.error(message, object) : console.error(message);
            case LogLevel.Info:
                return object !== undefined ? console.info(message, object) : console.info(message);
            case LogLevel.Trace:
                return object !== undefined ? console.trace(message, object) : console.trace(message);
            case LogLevel.Warn:
                return object !== undefined ? console.warn(message, object) : console.warn(message);
            default:
                break;
        }
    }
}
