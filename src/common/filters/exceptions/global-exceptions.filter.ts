import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import {
  CustomHttpExceptionResponse,
  HttpExceptionResponse,
} from 'src/common/models/http-exceptions.interface';
import * as fs from 'fs';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status: HttpStatus;
    let errorType: string;
    let errorMessage: string;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      errorType =
        (errorResponse as HttpExceptionResponse).error || exception.message;
      errorMessage = (errorResponse as HttpExceptionResponse).message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorType = 'Critical internal server error';
    }
    const errorResponse = this.getErrorResponse(
      status,
      errorType,
      errorMessage,
      req,
    );
    const errorLog = this.getErrorLog(errorResponse, req, exception);
    this.writeErrorLogToFile(errorLog);
    res.status(status).json(errorResponse);
  }
  private getErrorResponse = (
    status: HttpStatus,
    errorType: string,
    errorMessage,
    req: Request,
  ): CustomHttpExceptionResponse => ({
    statusCode: status,
    error: errorType,
    message: errorMessage,
    path: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  private getErrorLog = (
    errorResponse: CustomHttpExceptionResponse,
    req: Request,
    exception: unknown,
  ): string => {
    const { statusCode, error } = errorResponse;
    const { method, url } = req;
    const errorLog = `Response code: ${statusCode} - Method: ${method} - Pathname: ${url}\n
    ${exception instanceof HttpException ? exception.stack : error}\n\n
    ${JSON.stringify(errorResponse)}`;
    console.log(errorLog);
    return errorLog;
  };
  private writeErrorLogToFile = (errorLog: string): void => {
    fs.appendFile('error.log', errorLog, 'utf-8', (err) => {
      if (err) throw err;
    });
  };
}
