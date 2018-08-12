export class UnconfirmedAccountError extends Error {
    constructor(reason) {
        super(reason);
        // the next line is important so that the ValidationError constructor is not part
        // of the resulting stacktrace
        Error.captureStackTrace(this, UnconfirmedAccountError);
    }
}