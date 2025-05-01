import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/modules/user/enums/role.enum';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();

        // Prioridade 1: role do user (caso tenha JWT)
        const userRole = request.user?.role;

        // Prioridade 2: role vindo de um header (ex: client-type-role)
        const headerRole = request.headers['client-role'];

        const roleToCheck = userRole || headerRole;

        if (!roleToCheck) {
            throw new ForbiddenException('Cargo não identificado');
        }

        if (!requiredRoles.includes(roleToCheck)) {
            throw new ForbiddenException('Acesso negado: cargo insuficiente');
        }

        return true;
    }
}