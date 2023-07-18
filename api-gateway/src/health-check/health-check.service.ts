import {
  HttpException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AUTHORIZATION_SERVICE_NAME } from '../_proto/auth.pb';
import { USER_SERVICE_NAME } from '../_proto/user.pb';
import { HealthClient, HEALTH_SERVICE_NAME, Stub } from 'src/_proto/health-check.pb';

@Injectable()
export class HealthCheckService implements OnModuleInit {
  private authClient: HealthClient;

  private userClient: HealthClient;

  @Inject(AUTHORIZATION_SERVICE_NAME)
  private readonly grpcAuthClient: ClientGrpc;

  @Inject(USER_SERVICE_NAME)
  private readonly grpcUserClient: ClientGrpc;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  public onModuleInit(): void {
    this.authClient =
      this.grpcAuthClient.getService<HealthClient>(HEALTH_SERVICE_NAME);
    this.userClient =
      this.grpcUserClient.getService<HealthClient>(HEALTH_SERVICE_NAME);
  }

  public async check(request: Stub): Promise<any> {
    let authHealth: any;
    let userHealth: any;

    try {
      authHealth = await firstValueFrom(this.authClient.check(request));
    } catch {
      authHealth = { status: 2 };
    }
    try {
      userHealth = await firstValueFrom(this.userClient.check(request));
    } catch {
      userHealth = { status: 2 };
    }
    
    // try {
    //   const { data } = await firstValueFrom(
    //     this.httpService
    //       .get(`${this.configService.get<string>('file.baseURL')}/health-check`)
    //       .pipe(
    //         catchError((error) => {
    //           throw new HttpException(
    //             error.response.data,
    //             error.response.status,
    //           );
    //         }),
    //       ),
    //   );
    //   fileHealth = data;
    // } catch {
    //   fileHealth = { status: 2 };
    // }
   
    return {
      authHealth,
      userHealth
    };
  }
}
