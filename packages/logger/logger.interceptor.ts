import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Logger } from "winston";
import { ExtendedExpressRequest } from "./extended-express-request.interface";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<ExtendedExpressRequest>();
    const requestId =
      request.headers["X-Request-Id"] != null
        ? (request.headers["X-Request-Id"] as string)
        : "";
    const controllerName = context.getClass().name;

    const { query, body, params, url, method } = request;

    const loggerChild = this.logger.child({
      requestId,
      controller: controllerName,
      method,
      endpoint: url,
      data: {
        ...(body != null ? { body: body as unknown } : {}),
        ...(Object.keys(query)[0] != null ? { query } : {}),
        ...(Object.keys(params)[0] != null ? { params } : {}),
      },
    });

    request.logger = loggerChild;
    console.log("this works?")

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.info(
            `[${controllerName}][${requestId}] Incoming {${url}, ${method}}`
          )
        )
      );
  }
}
