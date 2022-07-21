import { Request, Response, NextFunction } from "express";

import { Logger } from "tslog";

export const log: Logger = new Logger();

/**
 * Catch async errors when awaiting promises
 */
export function runAsync(callback: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next);
  };
}
