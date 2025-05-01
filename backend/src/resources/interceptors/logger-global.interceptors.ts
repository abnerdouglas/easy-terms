import {
  CallHandler,
  ConsoleLogger,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { Request, Response } from "express";

@Injectable()
export class LoggerGlobalInterceptor implements NestInterceptor {
  constructor(private logger: ConsoleLogger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextHttp = context.switchToHttp();

    const request = contextHttp.getRequest<Request>();
    const response = contextHttp.getResponse<Response>();

    const { path, method } = request;
    const { statusCode } = response;
    this.logger.log(`${method} ${path}`);

    const instantBeforeControllator = Date.now();

    return next.handle().pipe(
      tap(() => {
        if ("user" in request) {
          if (request.user) {
            this.logger.log(`Rota acessada pelo usuário: ${request.user}`);
          }
        }
        const RouteExecutionTime = Date.now() - instantBeforeControllator;
        this.logger.log(
          `Resposta: status ${statusCode} - ${RouteExecutionTime}ms`,
        );
      }),
    );
  }
}
