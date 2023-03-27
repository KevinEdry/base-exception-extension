import { Request } from "express";
import { Logger } from "winston";

export interface ExtendedExpressRequest<T extends unknown = unknown>
  extends Request {
  logger: Logger;
  body: T;
}
