import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from './entities/template.entity';
import { TemplateType } from './entities/template-type.entity';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Template,
      TemplateType,
    ]),
  ],
  providers: [TemplateService],
  controllers: [TemplateController],
})
export class TemplateModule {}
