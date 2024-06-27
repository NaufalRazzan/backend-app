import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { checkPath } from "../utils/constants/whitelistPaths";
import { checkMethod } from "src/utils/constants/checkMethodPath";


@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger: Logger;

    constructor() {
        this.logger = new Logger(HttpExceptionFilter.name);
    }

    catch(exception: HttpException, host: ArgumentsHost) {
        let message = exception.getResponse() as any
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        let status = exception.getStatus();

        if(!checkPath(request.url) && status === HttpStatus.NOT_FOUND){
            status = HttpStatus.NOT_FOUND

            if(typeof message === 'string'){
                message = 'unknown url path'
            }
            else message.message = 'unknown url path'
        }
        else if(!checkMethod(request.method.toString(), request.url.toString()) && status === HttpStatus.METHOD_NOT_ALLOWED){
            status = HttpStatus.METHOD_NOT_ALLOWED

            if(typeof message === 'string'){
                message = 'invalid http method'
            }
            else message.message = 'invalid http method'
        }

        let msg = `${Array.isArray(message?.message) ? message?.message[0] : message?.message}`;
        let size = Buffer.byteLength(msg);

        if(status === HttpStatus.BAD_REQUEST || status === HttpStatus.NOT_FOUND || status === HttpStatus.UNAUTHORIZED || status === HttpStatus.CONFLICT){
            this.logger.log(`${request.ip} HTTP/:${request.httpVersion} ${request.headers['user-agent']} - ${status} ${request.method} ${request.url} '${msg}' ${size} bytes 0 ms`)
        }
        else if(status === HttpStatus.TOO_MANY_REQUESTS || status === HttpStatus.METHOD_NOT_ALLOWED || status === HttpStatus.FORBIDDEN){
            if(status === 429) msg = 'Too many requests'
            this.logger.warn(`${request.ip} HTTP/:${request.httpVersion} ${request.headers['user-agent']} - ${status} ${request.method} ${request.url} '${msg}' ${size} bytes 0 ms`)
        }
        else this.logger.error(`${request.ip} HTTP/:${request.httpVersion} ${request.headers['user-agent']} - ${status} ${request.method} ${request.url} '${msg}' ${size} bytes 0 ms`);

        
        response
            .status(status)
            .json({
                message: msg,
            });
    }
}