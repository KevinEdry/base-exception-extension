import { DynamicModule, Global, Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from "nest-winston";
import winston from "winston";
import { LoggerExceptionFilter } from "./logger.filter";
import { LoggingInterceptor } from "./logger.interceptor";

export interface LoggerModuleOptions {
  service: string;
  silent?: boolean;
}

@Global()
@Module({})
export class LoggerModule {
  static forRoot(options: LoggerModuleOptions): DynamicModule {
    return {
      module: LoggerModule,
      imports: [
        WinstonModule.forRoot({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(options.service, {
              colors: true,
              prettyPrint: true,
            })
          ),
          transports: [new winston.transports.Console()],
          silent: options.silent ?? false,
        }),
      ],
      providers: [
        LoggerExceptionFilter,
        LoggingInterceptor,
        {
          provide: APP_INTERCEPTOR,
          useClass: LoggingInterceptor,
        },
        {
          provide: APP_FILTER,
          useClass: LoggerExceptionFilter,
        },
      ],
      exports: [LoggingInterceptor, LoggerExceptionFilter],
    };
  }
}
