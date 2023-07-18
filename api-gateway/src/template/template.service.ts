import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);

  constructor(private readonly httpService: HttpService) {}

  async getTemplates(token: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get('/template', {
          headers: { Authorization: token },
        })
        .pipe(
          catchError((error) => {
            this.logger.error(error);
            throw new HttpException(
              error.response.data || error.message,
              error.response.status || error.status,
            );
          }),
        ),
    );
    return data;
  }
}
