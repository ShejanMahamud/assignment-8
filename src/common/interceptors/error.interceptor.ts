import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request: Request = ctx.getRequest();
    const response: Response = ctx.getResponse();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errRes =
      exception instanceof HttpException ? exception.getResponse() : {};

    let message: string;
    let errors: { field: string | null; message: string }[] | undefined;

    if (typeof errRes === 'string') {
      message = errRes;
    } else if (errRes !== null && typeof errRes === 'object') {
      // errorResponse is an object
      if ('message' in errRes) {
        const msg = (errRes as any).message;

        if (Array.isArray(msg)) {
          errors = msg.map((m) => ({
            field: null,
            message: m,
          }));
          message = 'Validation failed';
        } else if (typeof msg === 'string') {
          message = msg;
        } else {
          message = exception.message || 'Internal Server Error';
        }
      } else if (
        'error' in errRes &&
        typeof (errRes as any).error === 'string'
      ) {
        message = (errRes as any).error;
      } else {
        message = exception.message || 'Internal Server Error';
      }
    } else {
      message = exception.message || 'Internal Server Error';
    }

    response.status(statusCode).json({
      success: false,
      message,
      errors,
      meta: {
        statusCode: statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    });
  }
}
