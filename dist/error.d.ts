declare class ApiError {
    code: number;
    message: string;
    constructor(code: number, message: string);
    static badRequest(msg: string): ApiError;
    static internalError(msg: string): ApiError;
}
//# sourceMappingURL=error.d.ts.map