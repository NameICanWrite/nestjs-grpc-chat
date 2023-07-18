import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { TemplateService } from './template.service';
import { GetTemplatesResponseDto } from './dto/get-templates-response.dto';

@ApiTags('template')
@Controller('template')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  // TODO: Add dto for responses

  @Get()
  @ApiOperation({
    summary: 'get templates',
  })
  @ApiResponse({
    type: GetTemplatesResponseDto,
    isArray: true,
    status: 200,
  })
  async getTemplates(@Headers() { authorization }) {
    return this.templateService.getTemplates(authorization);
  }
}
