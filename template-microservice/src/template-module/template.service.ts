import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import {
  AlreadyExistsException,
  InvalidArgumentException,
  NotFoundException,
  PermissionDeniedException,
} from '../utils/exceptions';
import { Template } from './entities/template.entity';
import { TemplateType } from './entities/template-type.entity';
import {
  GetTemplateResponse,
  GetTemplateRequest,
  DeleteTemplateRequest,
  DeleteTemplateResponse,
  GetTemplatesResponse,
  CreateTemplateRequest,
  CreateTemplateResponse,
  UpdateTemplateRequest,
  CreateTemplateTypeRequest,
  UpdateTemplateResponse,
  CreateTemplateTypeResponse,
  GetTemplateTypeRequest,
  UpdateTemplateTypeRequest,
  DeleteTemplateTypeRequest,
  DeleteTemplateTypeResponse,
  GetTemplateTypeResponse,
  GetTemplateTypesResponse,
  UpdateTemplateTypeResponse,
  GetTemplatesRequest,
  GetTemplateTypesRequest,

} from '../_proto/template.pb';
import {
  TemplateTypeEnum,
} from './template.enum';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private templateRepository: Repository<Template>,
    @InjectRepository(TemplateType)
    private templateTypeRepository: Repository<TemplateType>
  ) {}

  // Template

  async createTemplate(
    createTemplateRequest: CreateTemplateRequest,
  ): Promise<CreateTemplateResponse> {
    const {
      name,
      description,
      templateTypeId,
    } = createTemplateRequest;


    const templateType = await this.templateTypeRepository.findOne({
      where: {
        id: templateTypeId,
      },
    });
    if (templateTypeId && !templateType) {
      throw new NotFoundException(`Template type with id ${templateTypeId} not found`);
    }


    const newTemplate = {
      name,
      description,
      templateType
    };
    return this.templateRepository.save(newTemplate);
  }

  async getTemplates(getTemplatesRequest: GetTemplatesRequest): Promise<GetTemplatesResponse> {
    const {
      limit,
      offset,
      templates,
    } = getTemplatesRequest;

    const [result, total] = await this.templateRepository.findAndCount({
      skip: offset,
      take: limit,
      where: {
        id: templates ? In(templates) : undefined,
      },
      relations: {
        templateType: true,
      },
    });
    
    return { result, total, limit, offset };
  }

  async getTemplate(getTemplateRequest: GetTemplateRequest): Promise<GetTemplateResponse> {
    const {
      id
    } = getTemplateRequest;

    const template = await this.templateRepository.findOne({
      where: { id },
      relations: {
        templateType: true,
        },
      });
    if (!template) {
      throw new NotFoundException(`Template with id ${id} not found`);
    }
    return template;
  }

  async updateTemplate(
    updateTemplateRequest: UpdateTemplateRequest,
  ): Promise<UpdateTemplateResponse> {
    const {
      id,
      templateTypeId,
      name,
      description
    } = updateTemplateRequest;
    const template = await this.templateRepository.findOne({
      relations: {
        templateType: true,
      },
      where: {
        id,
      },
    });

    if (!template) {
      throw new NotFoundException(`Template with id ${id} not found`);
    }

    const templateType = templateTypeId
      ? await this.templateTypeRepository.findOne({
          where: {
            id: templateTypeId,
          },
        })
      : undefined;

    if (templateTypeId && !templateType) {
      throw new NotFoundException(`Template type with id ${templateTypeId} not found`);
    }

    const res = await this.templateRepository
      .createQueryBuilder('template')
      .update(Template)
      .set({ templateType, name, description })
      .where('id = :id', { id })
      .returning('*')
      .execute();

    return res.raw[0];
  }

  async deleteTemplate(
    deleteTemplateRequest: DeleteTemplateRequest,
  ): Promise<DeleteTemplateResponse> {
    const { id } = deleteTemplateRequest;
    const template = await this.templateRepository.findOne({
      where: {
        id,
      },
    });

    if (!template) {
      throw new NotFoundException(`Template with id ${id} not found`);
    }

    await this.templateRepository.delete({
      id,
    });

    return {};
  }

  // TemplateType

  async createTemplateType(
    createTemplateTypeRequest: CreateTemplateTypeRequest,
  ): Promise<CreateTemplateTypeResponse> {
    const { name } = createTemplateTypeRequest;
    const templateType = await this.templateTypeRepository.findOne({
      where: 
        {
          name,
        },
    });
    if (templateType) {
      throw new AlreadyExistsException(
        `Template type with name ${name} already exists`,
      );
    }
    return this.templateTypeRepository.save(createTemplateTypeRequest);
  }

  async getTemplateTypes(
    getTemplateTypesRequest: GetTemplateTypesRequest,
  ): Promise<GetTemplateTypesResponse> {
    const { limit, offset } = getTemplateTypesRequest;
    const [result, total] = await this.templateTypeRepository.findAndCount({
      skip: offset,
      take: limit,
    });
    return { result, total, limit, offset };
  }

  async getTemplateType(
    getTemplateTypeRequest: GetTemplateTypeRequest,
  ): Promise<GetTemplateTypeResponse> {
    const { id } = getTemplateTypeRequest;
    const templateType = await this.templateTypeRepository.findOne({
      where: {
        id,
      },
    });
    if (!templateType) {
      throw new NotFoundException(`Template type with id ${id} not found`);
    }
    return templateType;
  }

  async updateTemplateType(
    updateTemplateTypeRequest: UpdateTemplateTypeRequest,
  ): Promise<UpdateTemplateTypeResponse> {
    const { id, name } = updateTemplateTypeRequest;
    const templateType = await this.templateTypeRepository.findOne({
      where: {
        id,
      },
    });
    if (!templateType) {
      throw new NotFoundException(`Template type with id ${id} not found`);
    }

    if (name) {
      const typeNameExists = await this.templateTypeRepository.findOne({
        where: { name },
      });
      if (typeNameExists && typeNameExists.id !== id) {
        throw new AlreadyExistsException(
          `Template type with name ${name} already exists`,
        );
      }
    }

    return this.templateTypeRepository.save({
      id,
      name
    });
  }

  async deleteTemplateType(
    deleteTemplateTypeRequest: DeleteTemplateTypeRequest,
  ): Promise<DeleteTemplateTypeResponse> {
    const { id } = deleteTemplateTypeRequest;
    const templateType = await this.templateTypeRepository.findOne({
      where: {
        id,
      },
    });
    if (!templateType) {
      throw new NotFoundException(`Template type with id ${id} not found`);
    }

    const typeInTemplates = await this.templateRepository.count({
      where: {
        templateType: {
          id,
        },
      },
    });
    if (typeInTemplates > 0) {
      throw new InvalidArgumentException(
        `Type ${templateType.name} is used in templates and cannot be deleted`,
      );
    }
    await this.templateTypeRepository.delete({
      id,
    });
    return {};
  }
}
