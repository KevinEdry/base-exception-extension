import { Module } from "@nestjs/common";
import { LoggerModule } from "logger";
import { AppController } from "./app.controller";

@Module({
  imports: [
    LoggerModule.forRoot({
      service: "Base Service",
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
