import {
  BadRequestException,
  Controller,
  Get,
  Patch,
  Post,
} from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  async upsertCell(): Promise<void> {
    throw new BadRequestException("welp");
  }
}
