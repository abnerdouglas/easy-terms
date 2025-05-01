import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";

export interface UserPayload {
  sub: string;
  username: string;
}

@Injectable()
export class AuthenticationService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    const userAuthenticated = await bcrypt.compare(password, user.password);

    if (!userAuthenticated) {
      throw new UnauthorizedException("O email ou a senha está incorreto.");
    }

    const payload: UserPayload = {
      sub: user.id, // subject = sujeito
      username: user.name,
    };

    return {
      acess_token: await this.jwtService.signAsync(payload),
    };
  }
}
