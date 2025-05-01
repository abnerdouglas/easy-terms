import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthenticationController } from "./authentication.controller";
import { AuthenticationService } from "./authentication.service";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>("SEGREDO_JWT"),
          signOptions: { expiresIn: "24h" },
        };
      },
      inject: [ConfigService],
      global: true,
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
