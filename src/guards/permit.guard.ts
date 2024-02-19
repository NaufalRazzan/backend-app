import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { permit } from 'src/utils/permit/permitHelper';

@Injectable()
export class PermitGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const username: string = request?.token.username
    const checkPermission = await permit.check(username.replace(/\s/g, ""), 'all', 'AdminManager')

    if(!checkPermission){
      throw new ForbiddenException('you are not authorized to access this resources')
    }

    return true;
  }
}
