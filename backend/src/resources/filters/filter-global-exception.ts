import {
  ArgumentsHost,
  Catch,
  ConsoleLogger,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch()
export class FilterGlobalException implements ExceptionFilter {
  constructor(
    private adapterHost: HttpAdapterHost,
    private loggerNativo: ConsoleLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    this.loggerNativo.error(exception);
    //console.error(exception);

    const { httpAdapter } = this.adapterHost;

    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    if ("usuario" in request) {
      this.loggerNativo.log(
        `Rota acessada pelo usuário ${request.usuario.sub}`,
      );
    }

    const { status, body } =
      exception instanceof HttpException
        ? {
            status: exception.getStatus(),
            body: exception.getResponse(),
          }
        : {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              timestamp: new Date().toISOString(),
              path: httpAdapter.getRequestUrl(request),
            },
          };

    httpAdapter.reply(response, body, status);
  }
}
