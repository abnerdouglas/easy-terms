import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UniqueEmailValidator } from "./validation/UniqueEmail.validation";
import { UserTermAcceptanceEntity } from "./entities/user-term-acceptance.entity";
import { TermModule } from "../term/term.module";
import { HistoryModule } from "../history/history.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserTermAcceptanceEntity]),
    TermModule,
    HistoryModule,
  ],  
  controllers: [UserController],
  providers: [UserService, UniqueEmailValidator],
  exports: [UserService],
})

export class UserModule {}
