import { Request, Response, NextFunction } from "express";
export declare const errorMiddleware: (error: Error, _req: Request, res: Response, _next: NextFunction) => void;
