import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext): boolean {
    
        // Usa a autenticação padrão do Passport JWT
        return super.canActivate(context) as boolean;
      }
    
      handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
          throw err || new UnauthorizedException('Token inválido ou ausente');
        }
        return user;
      }
}