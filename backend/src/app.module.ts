import { ClassSerializerInterceptor, ConsoleLogger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostgresConfigService } from "./config/postgres.config.service";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { UserModule } from "./modules/user/user.module";
import { FilterGlobalException } from "./resources/filters/filter-global-exception";
import { LoggerGlobalInterceptor } from "./resources/interceptors/logger-global.interceptors";
import { AuthenticationModule } from "./modules/auth/authentication.module";
import { TermModule } from "./modules/term/term.module";
import { HistoryModule } from "./modules/history/history.module";
import { EmailModule } from "./modules/email/email.module";
import { UserTermAcceptanceModule } from "./modules/acceptance/user-term-acceptance.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
    UserModule,
    AuthenticationModule,
    TermModule,
    HistoryModule,
    EmailModule,
    UserTermAcceptanceModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: FilterGlobalException,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerGlobalInterceptor,
    },
    ConsoleLogger,
  ],
})
export class AppModule {}
