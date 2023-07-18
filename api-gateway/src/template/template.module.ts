import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get('pm.baseURL'),
        timeout: 10 * 1000,
        maxRedirects: 5,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TemplateService],
  controllers: [TemplateController],
})
export class TemplateModule {}
