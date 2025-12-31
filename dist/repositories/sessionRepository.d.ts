import { Session } from "../models/types";
export declare const createSession: (metadata?: Record<string, any>) => Promise<Session>;
export declare const findSessionById: (id: string) => Promise<Session | null>;
export declare const incrementSessionMessageCount: (id: string) => Promise<void>;
export declare const getSessionMessageCount: (id: string) => Promise<number>;
