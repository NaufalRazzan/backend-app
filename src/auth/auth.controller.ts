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
    ){
        this.logger = new Logger(AuthController.name)
    }

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
        const msg = `New user ${body.username}`
        const result = {
            message: 'new user added'
        }
        const afterTime: any = new Date()

        const totalTime = afterTime - beforeTime

        this.logger.log(`${req.socket.remoteAddress} HTTP/:${req.httpVersion} ${req.headers['user-agent']} - ${HttpStatus.OK} ${req.method} ${req.url} '${msg}' ${Buffer.byteLength(JSON.stringify(result))} bytes ${totalTime} ms`)

        return result
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
        const [acc_token, role, username] = await this.authService.signIn(body)
        const msg = `${role === 'admin' ? `Admin ${username}` : `User ${username}`} logged in`
        const result = {
            message: 'welcome',
            acc_token: acc_token
        }
        const afterTime: any = new Date()

        const totalTime = afterTime - beforeTime

        this.logger.log(`${req.socket.remoteAddress} HTTP/:${req.httpVersion} ${req.headers['user-agent']} - ${HttpStatus.OK} ${req.method} ${req.url} '${msg}' ${Buffer.byteLength(JSON.stringify(result))} bytes ${totalTime} ms`)

        return result
    }

}
