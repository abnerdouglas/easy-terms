import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { Role } from "../user/enums/role.enum";

export interface UserPayload {
  sub: string;
  name: string;
  role: Role;
}

@Injectable()
export class AuthenticationService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) { }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    
    await this.userService.validateUser(email);

    const userAuthenticated = await bcrypt.compare(password, user.password);

    if (!userAuthenticated) {
      throw new UnauthorizedException("O email ou a senha está incorreto.");
    }

    const payload: UserPayload = {
      sub: user.id, // subject = sujeito
      name: user.name,
      role: user.role
    };

    return {
      acess_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
