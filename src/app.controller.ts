import { Controller, Get, HttpCode, HttpException, HttpStatus, Req, Logger } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";

@ApiTags('/')
@Controller('/')
export class AppController{
    constructor(
        private logger: Logger
    ){}
    
    @HttpCode(HttpStatus.OK)
    @Get()
    async home(@Req() req: Request){
        if(req.method != 'GET'){
            throw new HttpException('method not allowed', HttpStatus.METHOD_NOT_ALLOWED)
        }

        const beforeTime: any = new Date()
        const result = { message: 'welcome to movie pirate 2020' }
        const afterTime: any = new Date()

        const totalTime = afterTime - beforeTime

        this.logger.log(`${req.ip} ${HttpStatus.OK} ${req.method} | ${req.url} : Accessing homepage - Execution times ${totalTime} ms`)

        return result
    }
}