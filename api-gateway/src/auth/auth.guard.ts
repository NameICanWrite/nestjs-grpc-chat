import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import jwtDecode from 'jwt-decode';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { GetUserResponse } from 'src/_proto/user.pb';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) return false;

    const prefix = 'Bearer ';
    const token = request.headers.authorization.replace(prefix, '');
    const {isValid: isTokenValid} = await this.authService.verifyToken({ token });

    let doesUserExist: boolean = false;

    try {
      const { userId }: any = jwtDecode(token);

      // TODO: add caching to user service
      const userInfo = await this.userService.getUser(userId);
      if (userInfo) doesUserExist = true;

      request.user = {id: userId, ...userInfo}

    } catch (error) {
      console.log(error);
    }

    return isTokenValid && doesUserExist
  }
}


@Injectable()
export class AuthSocketGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake.query.token;

    if (!token) return false;

    const { isValid: isTokenValid } = await this.authService.verifyToken({ token });

    let doesUserExist = false;

    try {
      const { userId }: any = jwtDecode(token);

      
      

      // TODO: Add caching to user service
      const userInfo = await this.userService.getUser(userId);
      if (userInfo) doesUserExist = true;

      // Attach the user ID to the client
      client.data.user = {id: userId, ...userInfo};
    } catch (error) {
      console.log(error);
    }

    return isTokenValid && doesUserExist;
  }
}