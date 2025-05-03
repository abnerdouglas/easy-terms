import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UniqueEmailValidator } from "./validation/UniqueEmail.validation";
import { UserTermAcceptanceEntity } from "../acceptance/entities/user-term-acceptance.entity";
import { TermModule } from "../term/term.module";
import { HistoryModule } from "../history/history.module";
import { EmailModule } from "../email/email.module";
import { TermEntity } from "../term/entities/term.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserTermAcceptanceEntity, TermEntity]),
    TermModule,
    HistoryModule,
    EmailModule
  ],  
  controllers: [UserController],
  providers: [UserService, UniqueEmailValidator],
  exports: [UserService],
})

export class UserModule {}
