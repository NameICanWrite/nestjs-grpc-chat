/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Template, TemplateType } from "./common.pb";

export const protobufPackage = "template";

export interface CreateTemplateRequest {
  templateTypeId?: number;
  name?: string;
  description?: string;
}

export interface CreateTemplateResponse {
  id?: number;
  name?: string;
  description?: string;
  templateType?: TemplateType;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetTemplatesRequest {
  limit?: number;
  offset?: number;
  templates?: number[];
}

export interface GetTemplatesResponse {
  result?: Template[];
  total?: number;
  limit?: number;
  offset?: number;
}

export interface GetTemplateRequest {
  id?: number;
}

export interface GetTemplateResponse {
  id?: number;
  name?: string;
  description?: string;
  templateType?: TemplateType;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateTemplateRequest {
  id?: number;
  name?: string;
  description?: string;
  templateTypeId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateTemplateResponse {
  id?: number;
  name?: string;
  description?: string;
  templateType?: TemplateType;
  createdAt?: string;
  updatedAt?: string;
}

export interface DeleteTemplateRequest {
  id?: number;
}

export interface DeleteTemplateResponse {
}

export interface CreateTemplateTypeRequest {
  name?: string;
}

export interface CreateTemplateTypeResponse {
  id?: number;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetTemplateTypesRequest {
  limit?: number;
  offset?: number;
}

export interface GetTemplateTypesResponse {
  result?: TemplateType[];
  total?: number;
  limit?: number;
  offset?: number;
}

export interface GetTemplateTypeRequest {
  id?: number;
}

export interface GetTemplateTypeResponse {
  id?: number;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateTemplateTypeRequest {
  id?: number;
  name?: string;
}

export interface UpdateTemplateTypeResponse {
  id?: number;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DeleteTemplateTypeRequest {
  id?: number;
}

export interface DeleteTemplateTypeResponse {
}

export const TEMPLATE_PACKAGE_NAME = "template";

export interface TemplateServiceClient {
  createTemplate(request: CreateTemplateRequest, metadata?: Metadata): Observable<CreateTemplateResponse>;

  getTemplates(request: GetTemplatesRequest, metadata?: Metadata): Observable<GetTemplatesResponse>;

  getTemplate(request: GetTemplateRequest, metadata?: Metadata): Observable<GetTemplateResponse>;

  updateTemplate(request: UpdateTemplateRequest, metadata?: Metadata): Observable<UpdateTemplateResponse>;

  deleteTemplate(request: DeleteTemplateRequest, metadata?: Metadata): Observable<DeleteTemplateResponse>;

  createTemplateType(request: CreateTemplateTypeRequest, metadata?: Metadata): Observable<CreateTemplateTypeResponse>;

  getTemplateTypes(request: GetTemplateTypesRequest, metadata?: Metadata): Observable<GetTemplateTypesResponse>;

  getTemplateType(request: GetTemplateTypeRequest, metadata?: Metadata): Observable<GetTemplateTypeResponse>;

  updateTemplateType(request: UpdateTemplateTypeRequest, metadata?: Metadata): Observable<UpdateTemplateTypeResponse>;

  deleteTemplateType(request: DeleteTemplateTypeRequest, metadata?: Metadata): Observable<DeleteTemplateTypeResponse>;
}

export interface TemplateServiceController {
  createTemplate(
    request: CreateTemplateRequest,
    metadata?: Metadata,
  ): Promise<CreateTemplateResponse> | Observable<CreateTemplateResponse> | CreateTemplateResponse;

  getTemplates(
    request: GetTemplatesRequest,
    metadata?: Metadata,
  ): Promise<GetTemplatesResponse> | Observable<GetTemplatesResponse> | GetTemplatesResponse;

  getTemplate(
    request: GetTemplateRequest,
    metadata?: Metadata,
  ): Promise<GetTemplateResponse> | Observable<GetTemplateResponse> | GetTemplateResponse;

  updateTemplate(
    request: UpdateTemplateRequest,
    metadata?: Metadata,
  ): Promise<UpdateTemplateResponse> | Observable<UpdateTemplateResponse> | UpdateTemplateResponse;

  deleteTemplate(
    request: DeleteTemplateRequest,
    metadata?: Metadata,
  ): Promise<DeleteTemplateResponse> | Observable<DeleteTemplateResponse> | DeleteTemplateResponse;

  createTemplateType(
    request: CreateTemplateTypeRequest,
    metadata?: Metadata,
  ): Promise<CreateTemplateTypeResponse> | Observable<CreateTemplateTypeResponse> | CreateTemplateTypeResponse;

  getTemplateTypes(
    request: GetTemplateTypesRequest,
    metadata?: Metadata,
  ): Promise<GetTemplateTypesResponse> | Observable<GetTemplateTypesResponse> | GetTemplateTypesResponse;

  getTemplateType(
    request: GetTemplateTypeRequest,
    metadata?: Metadata,
  ): Promise<GetTemplateTypeResponse> | Observable<GetTemplateTypeResponse> | GetTemplateTypeResponse;

  updateTemplateType(
    request: UpdateTemplateTypeRequest,
    metadata?: Metadata,
  ): Promise<UpdateTemplateTypeResponse> | Observable<UpdateTemplateTypeResponse> | UpdateTemplateTypeResponse;

  deleteTemplateType(
    request: DeleteTemplateTypeRequest,
    metadata?: Metadata,
  ): Promise<DeleteTemplateTypeResponse> | Observable<DeleteTemplateTypeResponse> | DeleteTemplateTypeResponse;
}

export function TemplateServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createTemplate",
      "getTemplates",
      "getTemplate",
      "updateTemplate",
      "deleteTemplate",
      "createTemplateType",
      "getTemplateTypes",
      "getTemplateType",
      "updateTemplateType",
      "deleteTemplateType",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("TemplateService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("TemplateService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const TEMPLATE_SERVICE_NAME = "TemplateService";
