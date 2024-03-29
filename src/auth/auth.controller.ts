import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Logger, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NewUserDto } from 'src/validation/new-user.dto';
import { SignInDto } from 'src/validation/sign-in.dto';
import { Request } from 'express';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly logger: Logger
    ){}

    @ApiBody({ type: NewUserDto })
    @ApiOkResponse({
        description: 'new user has been registered',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        }
    })
    @HttpCode(HttpStatus.OK)
    @Post('/signup')
    @UsePipes(new ValidationPipe({ transform: true }))
    async signup(@Req() req: Request, @Body() body: NewUserDto){
        const beforeTime: any = new Date()
        await this.authService.signUp(body)
        const afterTime: any = new Date()

        const totalTime = afterTime - beforeTime

        this.logger.log(`${req.ip} ${req.method} | ${req.url}: Execution times ${totalTime} ms`)

        return {
            message: 'new user added'
        }
    }

    @ApiBody({ type: SignInDto })
    @ApiOkResponse({
        description: 'succesfull login',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                acc_token: { type: 'string' }
            }
        }
    })
    @HttpCode(HttpStatus.OK)
    @Post('/signin')
    @UsePipes(new ValidationPipe({ transform: true }))
    async signIn(@Req() req: Request, @Body() body: SignInDto){
        const beforeTime: any = new Date()
        const token = await this.authService.signIn(body)
        const afterTime: any = new Date()

        const totalTime = afterTime - beforeTime

        this.logger.log(`${req.ip} ${req.method} | ${req.url}: Execution times ${totalTime} ms`)

        return {
            message: 'welcome',
            acc_token: token
        }
    }

}
