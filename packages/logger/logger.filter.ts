import { ArgumentsHost, Catch, Inject, Logger } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { ExtendedExpressRequest } from "./extended-express-request.interface";

@Catch()
export class LoggerExceptionFilter extends BaseExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    super();
  }

  override catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<ExtendedExpressRequest>();
    console.log("????");
    console.log(exception);
    if (request.logger != null) {
      request.logger.error(exception);
    } else {
      this.logger.error(exception);
    }

    super.catch(exception, host);
  }
}
