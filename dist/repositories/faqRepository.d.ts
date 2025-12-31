import { FAQ } from "../models/types";
export declare const findFAQsByCategory: (category: string) => Promise<FAQ[]>;
export declare const searchFAQsByKeywords: (keywords: string[]) => Promise<FAQ[]>;
