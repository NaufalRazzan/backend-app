import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { MongooseError } from 'mongoose';
import { Request, Response } from "express";

@Catch(MongoValidationErrorFilter)
export class MongoValidationErrorFilter implements ExceptionFilter {
  private readonly logger: Logger;

  constructor() {
      this.logger = new Logger(MongoValidationErrorFilter.name);
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>()

    if(exception instanceof MongooseError && exception.name === 'ValidationError'){
      this.logger.log(`${request.ip} ${request.method} | ${request.url}: ${exception.message}`);
      response
        .status(HttpStatus.BAD_REQUEST)
        .json({
          message: exception.message
        })
    }
    else{
      this.logger.error(`${request.ip} ${request.method} | ${request.url}: ${exception?.message}`);
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message: 'Internal Server Error'
        })
    }
  }
}
