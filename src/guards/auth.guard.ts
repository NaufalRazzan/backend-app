import { BadRequestException, CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TokenPayload } from 'src/utils/constants/tokenPayload';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtservice: JwtService,
  ){}

  private extractTokenFromHeader(req: Request): string | undefined{
    const [type, token] = req.headers.authorization?.split(' ') ?? []

    return type == 'Bearer' ? token : undefined
  }

  async canActivate(context: ExecutionContext): Promise<boolean>{
    let request: Request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if(token === undefined){
      throw new BadRequestException('token not found')
    }
    
    try {
      const res = await this.jwtservice.verifyAsync<TokenPayload>(token, { secret: process.env.SECRET_KEY_USER })
      request['token'] = res
    } catch (error) {
      throw new UnauthorizedException('please try again to login')
    }

    return true
  }
}
