import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RpcExceptionFilter } from '../utils/exceptions';
import {
  CreateTemplateRequest,
  CreateTemplateResponse,
  CreateTemplateTypeRequest,
  CreateTemplateTypeResponse,
  DeleteTemplateRequest,
  DeleteTemplateResponse,
  GetTemplateRequest,
  GetTemplateResponse,
  GetTemplatesResponse,
  TEMPLATE_SERVICE_NAME,
  UpdateTemplateRequest,
  UpdateTemplateResponse,
  TemplateServiceControllerMethods,
  TemplateServiceController,
  DeleteTemplateTypeRequest,
  DeleteTemplateTypeResponse,
  GetTemplateTypeRequest,
  GetTemplateTypeResponse,
  GetTemplateTypesResponse,
  UpdateTemplateTypeRequest,
  UpdateTemplateTypeResponse,
  GetTemplatesRequest,
  GetTemplateTypesRequest,
} from '../_proto/template.pb';
import { TemplateService } from './template.service';

@TemplateServiceControllerMethods()
@Controller()
export class TemplateController implements TemplateServiceController {
  constructor(private readonly templateService: TemplateService) {}

  // Template

  @GrpcMethod(TEMPLATE_SERVICE_NAME, 'CreateTemplate')
  @UseFilters(RpcExceptionFilter.for('TemplateController::CreateTemplate'))
  createTemplate(
    createTemplateRequest: CreateTemplateRequest,
  ): Promise<CreateTemplateResponse> {
    return this.templateService.createTemplate(createTemplateRequest);
  }

  @GrpcMethod(TEMPLATE_SERVICE_NAME, 'GetTemplates')
  @UseFilters(RpcExceptionFilter.for('TemplateController::GetTemplates'))
  getTemplates(getTemplatesRequest: GetTemplatesRequest): Promise<GetTemplatesResponse> {
    return this.templateService.getTemplates(getTemplatesRequest);
  }

  @GrpcMethod(TEMPLATE_SERVICE_NAME, 'GetTemplate')
  @UseFilters(RpcExceptionFilter.for('TemplateController::GetTemplate'))
  getTemplate(templateRequest: GetTemplateRequest): Promise<GetTemplateResponse> {
    return this.templateService.getTemplate(templateRequest);
  }

  @GrpcMethod(TEMPLATE_SERVICE_NAME, 'UpdateTemplate')
  @UseFilters(RpcExceptionFilter.for('TemplateController::UpdateTemplate'))
  updateTemplate(
    updateTemplateRequest: UpdateTemplateRequest,
  ): Promise<UpdateTemplateResponse> {
    return this.templateService.updateTemplate(updateTemplateRequest);
  }

  @GrpcMethod(TEMPLATE_SERVICE_NAME, 'DeleteTemplate')
  @UseFilters(RpcExceptionFilter.for('TemplateController::DeleteTemplate'))
  deleteTemplate(
    deleteTemplateRequest: DeleteTemplateRequest,
  ): Promise<DeleteTemplateResponse> {
    return this.templateService.deleteTemplate(deleteTemplateRequest);
  }

  // TemplateType

  @GrpcMethod(TEMPLATE_SERVICE_NAME, 'CreateTemplateType')
  @UseFilters(RpcExceptionFilter.for('TemplateController::CreateTemplateType'))
  createTemplateType(
    createTemplateTypeRequest: CreateTemplateTypeRequest,
  ): Promise<CreateTemplateTypeResponse> {
    return this.templateService.createTemplateType(createTemplateTypeRequest);
  }

  @GrpcMethod(TEMPLATE_SERVICE_NAME, 'GetTemplateTypes')
  @UseFilters(RpcExceptionFilter.for('TemplateController::GetTemplateTypes'))
  getTemplateTypes(
    getTemplateTypesRequest: GetTemplateTypesRequest,
  ): Promise<GetTemplateTypesResponse> {
    return this.templateService.getTemplateTypes(getTemplateTypesRequest);
  }

  @GrpcMethod(TEMPLATE_SERVICE_NAME, 'GetTemplateType')
  @UseFilters(RpcExceptionFilter.for('TemplateController::GetTemplateType'))
  getTemplateType(
    getTemplateTypeRequest: GetTemplateTypeRequest,
  ): Promise<GetTemplateTypeResponse> {
    return this.templateService.getTemplateType(getTemplateTypeRequest);
  }

  @GrpcMethod(TEMPLATE_SERVICE_NAME, 'UpdateTemplateType')
  @UseFilters(RpcExceptionFilter.for('TemplateController::UpdateTemplateType'))
  updateTemplateType(
    updateTemplateTypeRequest: UpdateTemplateTypeRequest,
  ): Promise<UpdateTemplateTypeResponse> {
    return this.templateService.updateTemplateType(updateTemplateTypeRequest);
  }

  @GrpcMethod(TEMPLATE_SERVICE_NAME, 'DeleteTemplateType')
  @UseFilters(RpcExceptionFilter.for('TemplateController::DeleteTemplateType'))
  deleteTemplateType(
    deleteTemplateTypeRequest: DeleteTemplateTypeRequest,
  ): Promise<DeleteTemplateTypeResponse> {
    return this.templateService.deleteTemplateType(deleteTemplateTypeRequest);
  }
}
