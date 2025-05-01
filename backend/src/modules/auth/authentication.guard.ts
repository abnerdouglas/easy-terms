import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { UserPayload } from "./authentication.service";
import { JwtService } from "@nestjs/jwt";

export interface RequestWithUser extends Request {
  user: UserPayload;
}

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException("Erro de autenticação");
    }

    try {
      const payload: UserPayload = await this.jwtService.verifyAsync(token);
      request.user = payload;
    } catch (error) {
      //console.error(error);
      throw new UnauthorizedException("JWT inválido");
    }
    return true;
  }
  private extractTokenFromHeader(requisicao: Request): string | undefined {
    //formato do cabeçalho authorizathon: "Bearer <valor_do_jwt>" -> protocolo HTTP
    const [tipo, token] = requisicao.headers.authorization?.split(" ") ?? [];
    return tipo === "Bearer" ? token : undefined;
  }
}
