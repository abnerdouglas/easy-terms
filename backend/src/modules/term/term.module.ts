import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TermEntity } from "./entities/term.entity";
import { TermController } from "./term.controller";
import { TermService } from "./term.service";
import { HistoryModule } from "../history/history.module";
import { UserTermAcceptanceEntity } from "../acceptance/entities/user-term-acceptance.entity";
import { EmailModule } from "../email/email.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([TermEntity, UserTermAcceptanceEntity]),
    HistoryModule,
    forwardRef(() => UserModule),
    EmailModule,
  ],
  controllers: [TermController],
  providers: [TermService],
  exports: [TermService],
})

export class TermModule { }
