import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TermEntity } from "./entities/term.entity";
import { TermController } from "./term.controller";
import { TermService } from "./term.service";
import { HistoryModule } from "../history/history.module";
import { UserTermAcceptanceEntity } from "../user/entities/user-term-acceptance.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TermEntity, UserTermAcceptanceEntity]), HistoryModule],
  controllers: [TermController],
  providers: [TermService],
  exports: [TermService],
})

export class TermModule {}
