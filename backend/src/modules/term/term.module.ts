import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TermEntity } from "./term.entity";
import { TermController } from "./term.controller";
import { TermService } from "./term.service";

@Module({
  imports: [TypeOrmModule.forFeature([TermEntity])],
  controllers: [TermController],
  providers: [TermService],
  exports: [TermService],
})
export class TermModule {}
