export declare const createValidationError: (message: string) => Error;
export declare const handleError: (error: Error) => {
    statusCode: number;
    message: string;
};
