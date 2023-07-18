import { INestMicroservice } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  ClientGrpc,
  ClientsModule,
  MicroserviceOptions,
} from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { DataSource, Repository } from 'typeorm';
import { Type } from '../../src/common.pb';
import testDatabaseConfig from '../../src/config/test-database.config';
import { HealthCheckModule } from '../../src/health-check/health-check.module';
import {
  HEALTH_SERVICE_NAME,
  HealthClient,
} from '../../src/health-check/health-check.pb';
import { TaskResponsibleHistory } from '../../src/history/entities/task-responsible-history.entity';
import { TaskStatusHistory } from '../../src/history/entities/task-status-history.entity';
import { TaskResultAnswer } from '../../src/result/entites/task-result-answer.entity';
import { TaskResultData } from '../../src/result/entites/task-result-data.entity';
import { TaskResult } from '../../src/result/entites/task-result.entity';
import { TaskStatusReason } from '../../src/file/entities/task-status-reason.entity';
import { TaskStatus } from '../../src/file/entities/task-status.entity';
import { TaskType } from '../../src/file/entities/template-type.entity';
import { TaskWorkType } from '../../src/file/entities/task-work-type.entity';
import { Task } from '../../src/file/entities/template.entity';
import {
  TaskStatusEnum,
  TaskStatusReasonEnum,
  TaskTypeEnum,
  TaskWorkTypeEnum,
  TypeEnum,
} from '../../src/file/template.enum';
import { TaskModule } from '../../src/file/file.module';
import { TASK_SERVICE_NAME, TaskServiceClient } from '../../src/file/template.pb';
import { validate } from '../../src/utils/validators/environment.validator';
import { TaskVerification } from '../../src/verification/entities/task-verification.entity';
import { TypeOrmTestConfigService } from '../database/typeorm-test-config.service';
import { grpcTaskClientOptions, grpcTaskOptions } from '../grpc.config';

describe('Task Module (e2e)', () => {
  let app: INestMicroservice;

  let taskServiceClient: TaskServiceClient;

  let healthCheckClient: HealthClient;

  let taskRepository: Repository<Task>;

  let taskResultRepository: Repository<TaskResult>;

  let taskTypeRepository: Repository<TaskType>;

  let taskWorkTypeRepository: Repository<TaskWorkType>;

  let taskStatusRepository: Repository<TaskStatus>;

  let taskStatusReasonRepository: Repository<TaskStatusReason>;

  let taskResultDataRepository: Repository<TaskResultData>;

  let taskVerificationRepository: Repository<TaskVerification>;

  let taskResultAnswerRepository: Repository<TaskResultAnswer>;

  let taskStatusHistoryRepository: Repository<TaskStatusHistory>;

  let taskResponsibleHistoryRepository: Repository<TaskResponsibleHistory>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.development.local', '.env.development', '.env'],
          validate,
          load: [testDatabaseConfig],
        }),
        TypeOrmModule.forRootAsync({
          useClass: TypeOrmTestConfigService,
          dataSourceFactory: async (options) => {
            return new DataSource(options).initialize();
          },
        }),
        HealthCheckModule,
        TaskModule,
        ClientsModule.register([grpcTaskClientOptions]),
        TypeOrmModule.forFeature([
          TaskVerification,
          TaskResult,
          TaskResultData,
          TaskResultAnswer,
          TaskStatusHistory,
          TaskResponsibleHistory,
        ]),
      ],
    }).compile();

    app =
      moduleFixture.createNestMicroservice<MicroserviceOptions>(
        grpcTaskOptions,
      );
    await app.listen();

    taskRepository = app.get<Repository<Task>>(getRepositoryToken(Task));

    taskResultRepository = app.get<Repository<TaskResult>>(
      getRepositoryToken(TaskResult),
    );

    taskStatusReasonRepository = app.get<Repository<TaskStatusReason>>(
      getRepositoryToken(TaskStatusReason),
    );

    taskTypeRepository = app.get<Repository<TaskType>>(
      getRepositoryToken(TaskType),
    );

    taskStatusRepository = app.get<Repository<TaskStatus>>(
      getRepositoryToken(TaskStatus),
    );

    taskWorkTypeRepository = app.get<Repository<TaskWorkType>>(
      getRepositoryToken(TaskWorkType),
    );

    taskVerificationRepository = app.get<Repository<TaskVerification>>(
      getRepositoryToken(TaskVerification),
    );

    taskResultDataRepository = app.get<Repository<TaskResultData>>(
      getRepositoryToken(TaskResultData),
    );

    taskResultAnswerRepository = app.get<Repository<TaskResultAnswer>>(
      getRepositoryToken(TaskResultAnswer),
    );

    taskStatusHistoryRepository = app.get<Repository<TaskStatusHistory>>(
      getRepositoryToken(TaskStatusHistory),
    );

    taskResponsibleHistoryRepository = app.get<
      Repository<TaskResponsibleHistory>
    >(getRepositoryToken(TaskResponsibleHistory));

    const client = app.get<ClientGrpc>(TASK_SERVICE_NAME);
    healthCheckClient = client.getService<HealthClient>(HEALTH_SERVICE_NAME);
    taskServiceClient = client.getService<TaskServiceClient>(TASK_SERVICE_NAME);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('HealthCheck', () => {
    it('Check status', async () => {
      const result = await firstValueFrom(healthCheckClient.check({}));
      expect(result).toEqual({ status: 1 });
    });
  });

  describe('Task controller', () => {
    const b24TaskId = 5;

    let taskId;

    const date = new Date();

    const createTaskRequest = {
      b24TaskId,
      startDate: date.toISOString(),
      endDate: new Date(date.setDate(date.getDate() + 1)).toISOString(),
      estimateByUser: 1,
      userResponsibleId: 1,
      taskTypeId: 1,
      taskWorkTypeId: 1,
    };

    // Task

    describe('Task', () => {
      const updateTaskStatusDeclinedRequest = {
        b24TaskId,
        userCreatorId: 1,
        statusReasons: [5],
        userResponsibleId: 1,
      };

      const updateTaskStatusInProgressRequest = {
        b24TaskId,
        userCreatorId: 1,
        statusReasons: [17],
      };

      const updateTaskStatusDeferredRequest = {
        b24TaskId,
        userCreatorId: 1,
        statusReasons: [1],
        userResponsibleId: 1,
      };

      const updateTaskStatusSupposedlyCompletedRequest = {
        b24TaskId,
        userCreatorId: 1,
      };

      const updateTaskStatusCompletedRequest = {
        b24TaskId,
        userCreatorId: 1,
        statusReasons: [11],
      };

      it('should create task', async () => {
        const result = await firstValueFrom(
          taskServiceClient.createTask(createTaskRequest),
        );
        const {
          id,
          b24Id,
          startDate,
          endDate,
          estimateByUser,
          userResponsibleId,
          taskType,
          taskWorkType,
          createdAt,
          updatedAt,
        } = result;

        taskId = id;

        expect(result).toBeDefined();
        expect(id).toBeDefined();
        expect({
          startDate,
          endDate,
          estimateByUser,
          userResponsibleId,
          b24TaskId: b24Id,
          taskTypeId: taskType.id,
          taskWorkTypeId: taskWorkType.id,
        }).toEqual(createTaskRequest);
        expect(new Date(createdAt).toISOString()).toBeDefined();
        expect(new Date(updatedAt).toISOString()).toBeDefined();
      });

      it('should get task', async () => {
        const result = await firstValueFrom(
          taskServiceClient.getTask({
            b24TaskId,
            withTaskResults: true,
            withTaskStatusHistories: true,
            withTaskResponsibleHistories: true,
            withTaskVerifications: true,
          }),
        );

        const {
          id,
          b24Id,
          estimateByUser,
          userResponsibleId,
          taskType,
          taskWorkType,
          createdAt,
          updatedAt,
          taskResults,
          taskStatusHistories,
          taskResponsibleHistories,
          taskVerifications,
        } = result;

        expect(result).toBeDefined();
        expect(id).toBeDefined();
        expect(taskResults).toBeDefined();
        expect(taskStatusHistories).toBeDefined();
        expect(taskResponsibleHistories).toBeDefined();
        expect(taskVerifications).toBeDefined();
        expect({
          startDate: createTaskRequest.startDate,
          endDate: createTaskRequest.endDate,
          estimateByUser,
          userResponsibleId,
          b24TaskId: b24Id,
          taskTypeId: taskType.id,
          taskWorkTypeId: taskWorkType.id,
        }).toEqual(createTaskRequest);
        expect(new Date(createdAt).toISOString()).toBeDefined();
        expect(new Date(updatedAt).toISOString()).toBeDefined();
      });

      it('should get tasks', async () => {
        const { result, total, limit, offset } = await firstValueFrom(
          taskServiceClient.getTasks({
            withTaskResponsibleHistories: true,
            withTaskStatusHistories: true,
            withTaskResults: true,
            withTaskVerifications: true,
          }),
        );

        const {
          id,
          b24Id,
          estimateByUser,
          userResponsibleId,
          taskType,
          taskWorkType,
          createdAt,
          updatedAt,
          taskResults,
          taskStatusHistories,
          taskResponsibleHistories,
          taskVerifications,
        } = result.find((task) => task.b24Id === b24TaskId);

        expect(result).toBeDefined();
        expect(id).toBeDefined();
        expect(total).toBeGreaterThanOrEqual(1);
        expect(limit).toEqual(0);
        expect(offset).toEqual(0);
        expect(taskResults).toBeDefined();
        expect(taskStatusHistories).toBeDefined();
        expect(taskResponsibleHistories).toBeDefined();
        expect(taskVerifications).toBeDefined();
        expect({
          startDate: createTaskRequest.startDate,
          endDate: createTaskRequest.endDate,
          estimateByUser,
          userResponsibleId,
          b24TaskId: b24Id,
          taskTypeId: taskType.id,
          taskWorkTypeId: taskWorkType.id,
        }).toEqual(createTaskRequest);
        expect(new Date(createdAt).toISOString()).toBeDefined();
        expect(new Date(updatedAt).toISOString()).toBeDefined();
      });

      it('should get task limits, offset', async () => {
        const { result, total, limit, offset } = await firstValueFrom(
          taskServiceClient.getTasks({
            limit: 1,
            offset: 1,
          }),
        );

        expect(result).toBeDefined();
        expect(total).toBeGreaterThanOrEqual(1);
        expect(limit).toEqual(1);
        expect(offset).toEqual(1);
      });

      it('should update task', async () => {
        const updatedStartDate = new Date(date.setDate(date.getDate() + 1));
        const updatedEndDate = new Date(date.setDate(date.getDate() + 2));

        updatedStartDate.setMilliseconds(0);
        updatedEndDate.setMilliseconds(0);

        const updateTaskRequest = {
          id: taskId,
          taskTypeId: 2,
          taskWorkTypeId: 2,
          estimateByUser: 2,
          startDate: updatedStartDate.toISOString(),
          endDate: updatedEndDate.toISOString(),
        };

        const result = await firstValueFrom(
          taskServiceClient.updateTask(updateTaskRequest),
        );

        const {
          id,
          b24Id,
          estimateByUser,
          taskTypeId,
          taskWorkTypeId,
          startDate,
          endDate,
          createdAt,
          updatedAt,
        } = result;

        expect(result).toBeDefined();
        expect(id).toBeDefined();
        expect({
          id,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          taskTypeId,
          taskWorkTypeId,
          estimateByUser,
        }).toEqual(updateTaskRequest);
        expect(b24Id).toEqual(b24TaskId);
        expect(new Date(createdAt).toISOString()).toBeDefined();
        expect(new Date(updatedAt).toISOString()).toBeDefined();
      });

      // In progress

      it('should update task from status declined to status in progress', async () => {
        await firstValueFrom(
          taskServiceClient.updateTaskStatusDeclined(
            updateTaskStatusDeclinedRequest,
          ),
        );

        await firstValueFrom(
          taskServiceClient.updateTaskStatusInProgress(
            updateTaskStatusInProgressRequest,
          ),
        );

        const result = await firstValueFrom(
          taskServiceClient.getTask({
            b24TaskId,
          }),
        );
        expect(result.taskStatus.key).toEqual(TaskStatusEnum.IN_PROGRESS);
      });

      it('should update task from status deferred to status in progress', async () => {
        await firstValueFrom(
          taskServiceClient.updateTaskStatusDeferred(
            updateTaskStatusDeferredRequest,
          ),
        );
        await firstValueFrom(
          taskServiceClient.updateTaskStatusInProgress(
            updateTaskStatusInProgressRequest,
          ),
        );
        const result = await firstValueFrom(
          taskServiceClient.getTask({
            b24TaskId,
          }),
        );
        expect(result.taskStatus.key).toEqual(TaskStatusEnum.IN_PROGRESS);
      });

      it('should update task from  status supposedly completed to status in progress', async () => {
        await firstValueFrom(
          taskServiceClient.updateTaskStatusSupposedlyCompleted(
            updateTaskStatusSupposedlyCompletedRequest,
          ),
        );
        await firstValueFrom(
          taskServiceClient.updateTaskStatusInProgress(
            updateTaskStatusInProgressRequest,
          ),
        );
        const result = await firstValueFrom(
          taskServiceClient.getTask({
            b24TaskId,
          }),
        );
        expect(result.taskStatus.key).toEqual(TaskStatusEnum.IN_PROGRESS);
      });

      it('should update task from status completed to status in progress', async () => {
        await firstValueFrom(
          taskServiceClient.updateTaskStatusCompleted(
            updateTaskStatusCompletedRequest,
          ),
        );
        await firstValueFrom(
          taskServiceClient.updateTaskStatusInProgress(
            updateTaskStatusInProgressRequest,
          ),
        );
        const result = await firstValueFrom(
          taskServiceClient.getTask({
            b24TaskId,
          }),
        );
        expect(result.taskStatus.key).toEqual(TaskStatusEnum.IN_PROGRESS);
      });

      // Supposedly completed

      it('should update task from status in progress to status supposedly completed', async () => {
        await firstValueFrom(
          taskServiceClient.updateTaskStatusSupposedlyCompleted(
            updateTaskStatusSupposedlyCompletedRequest,
          ),
        );

        const result = await firstValueFrom(
          taskServiceClient.getTask({
            b24TaskId,
          }),
        );

        expect(result.taskStatus.key).toEqual(
          TaskStatusEnum.SUPPOSEDLY_COMPLETED,
        );

        await firstValueFrom(
          taskServiceClient.updateTaskStatusInProgress(
            updateTaskStatusInProgressRequest,
          ),
        );
      });

      it('should not update task from status deferred to status supposedly completed', async () => {
        await firstValueFrom(
          taskServiceClient.updateTaskStatusDeferred(
            updateTaskStatusDeferredRequest,
          ),
        );

        await expect(
          firstValueFrom(
            taskServiceClient.updateTaskStatusSupposedlyCompleted(
              updateTaskStatusSupposedlyCompletedRequest,
            ),
          ),
        ).rejects.toThrowError(Error);

        await firstValueFrom(
          taskServiceClient.updateTaskStatusInProgress(
            updateTaskStatusInProgressRequest,
          ),
        );
      });

      it('should not update task from status declined to status supposedly completed', async () => {
        await firstValueFrom(
          taskServiceClient.updateTaskStatusDeclined(
            updateTaskStatusDeclinedRequest,
          ),
        );

        await expect(
          firstValueFrom(
            taskServiceClient.updateTaskStatusSupposedlyCompleted(
              updateTaskStatusSupposedlyCompletedRequest,
            ),
          ),
        ).rejects.toThrowError(Error);

        await firstValueFrom(
          taskServiceClient.updateTaskStatusInProgress(
            updateTaskStatusInProgressRequest,
          ),
        );
      });

      it('should not update task from status completed to status supposedly completed', async () => {
        await firstValueFrom(
          taskServiceClient.updateTaskStatusCompleted(
            updateTaskStatusCompletedRequest,
          ),
        );

        await expect(
          firstValueFrom(
            taskServiceClient.updateTaskStatusSupposedlyCompleted(
              updateTaskStatusSupposedlyCompletedRequest,
            ),
          ),
        ).rejects.toThrowError(Error);

        await firstValueFrom(
          taskServiceClient.updateTaskStatusInProgress(
            updateTaskStatusInProgressRequest,
          ),
        );
      });

      // Completed

      it('should update task from status supposedly completed to status completed', async () => {
        await firstValueFrom(
          taskServiceClient.updateTaskStatusSupposedlyCompleted(
            updateTaskStatusSupposedlyCompletedRequest,
          ),
        );

        await firstValueFrom(
          taskServiceClient.updateTaskStatusCompleted(
            updateTaskStatusCompletedRequest,
          ),
        );

        const result = await firstValueFrom(
          taskServiceClient.getTask({
            b24TaskId,
          }),
        );

        expect(result.taskStatus.key).toEqual(TaskStatusEnum.COMPLETED);

        await firstValueFrom(
          taskServiceClient.updateTaskStatusInProgress(
            updateTaskStatusInProgressRequest,
          ),
        );
      });

      it('should update task from status in progress to status completed', async () => {
        await firstValueFrom(
          taskServiceClient.updateTaskStatusCompleted(
            updateTaskStatusCompletedRequest,
          ),
        );

        const result = await firstValueFrom(
          taskServiceClient.getTask({
            b24TaskId,
          }),
        );

        expect(result.taskStatus.key).toEqual(TaskStatusEnum.COMPLETED);

        await firstValueFrom(
          taskServiceClient.updateTaskStatusInProgress(
            updateTaskStatusInProgressRequest,
          ),
        );
      });

      it('should not update task from status deferred to status completed', async () => {
        await firstValueFrom(
          taskServiceClient.updateTaskStatusDeferred(
            updateTaskStatusDeferredRequest,
          ),
        );

        await expect(
          firstValueFrom(
            taskServiceClient.updateTaskStatusCompleted(
              updateTaskStatusCompletedRequest,
            ),
          ),
        ).rejects.toThrowError(Error);

        await firstValueFrom(
          taskServiceClient.updateTaskStatusInProgress(
            updateTaskStatusInProgressRequest,
          ),
        );
      });

      it('should not update task from status declined to status completed', async () => {
        await firstValueFrom(
          taskServiceClient.updateTaskStatusDeclined(
            updateTaskStatusDeclinedRequest,
          ),
        );

        await expect(
          firstValueFrom(
            taskServiceClient.updateTaskStatusCompleted(
              updateTaskStatusCompletedRequest,
            ),
          ),
        ).rejects.toThrowError(Error);

        await firstValueFrom(
          taskServiceClient.updateTaskStatusInProgress(
            updateTaskStatusInProgressRequest,
          ),
        );
      });

      // Deffered

      it('should update task from status in progress to status deferred', async () => {
        await firstValueFrom(
          taskServiceClient.updateTaskStatusDeferred(
            updateTaskStatusDeferredRequest,
          ),
        );

        const result = await firstValueFrom(
          taskServiceClient.getTask({
            b24TaskId,
          }),
        );

        expect(result.taskStatus.key).toEqual(TaskStatusEnum.DEFERRED);

        await firstValueFrom(
          taskServiceClient.updateTaskStatusInProgress(
            updateTaskStatusInProgressRequest,
          ),
        );
      });

      it('should not update task from status declined to status deferred', async () => {
        await firstValueFrom(
          taskServiceClient.updateTaskStatusDeclined(
            updateTaskStatusDeclinedRequest,
          ),
        );

        await expect(
          firstValueFrom(
            taskServiceClient.updateTaskStatusDeferred(
              updateTaskStatusDeferredRequest,
            ),
          ),
        ).rejects.toThrowError(Error);

        await firstValueFrom(
          taskServiceClient.updateTaskStatusInProgress(
            updateTaskStatusInProgressRequest,
          ),
        );
      });

      it('should not update task from status supposedly completed to status deferred', async () => {
        await firstValueFrom(
          taskServiceClient.updateTaskStatusSupposedlyCompleted(
            updateTaskStatusSupposedlyCompletedRequest,
          ),
        );

        await expect(
          firstValueFrom(
            taskServiceClient.updateTaskStatusDeclined(
              updateTaskStatusDeferredRequest,
            ),
          ),
        ).rejects.toThrowError(Error);

        await firstValueFrom(
          taskServiceClient.updateTaskStatusInProgress(
            updateTaskStatusInProgressRequest,
          ),
        );
      });

      it('should not update task from status completed to status deferred', async () => {
        await firstValueFrom(
          taskServiceClient.updateTaskStatusCompleted(
            updateTaskStatusCompletedRequest,
          ),
        );

        await expect(
          firstValueFrom(
            taskServiceClient.updateTaskStatusDeferred(
              updateTaskStatusDeferredRequest,
            ),
          ),
        ).rejects.toThrowError(Error);

        await firstValueFrom(
          taskServiceClient.updateTaskStatusInProgress(
            updateTaskStatusInProgressRequest,
          ),
        );
      });

      // Declined

      it('should update task from status in progress to status declined', async () => {
        await firstValueFrom(
          taskServiceClient.updateTaskStatusDeclined(
            updateTaskStatusDeclinedRequest,
          ),
        );

        const result = await firstValueFrom(
          taskServiceClient.getTask({
            b24TaskId,
          }),
        );

        expect(result.taskStatus.key).toEqual(TaskStatusEnum.DECLINED);

        await firstValueFrom(
          taskServiceClient.updateTaskStatusInProgress(
            updateTaskStatusInProgressRequest,
          ),
        );
      });

      it('should not update task from status deferred to status declined', async () => {
        await firstValueFrom(
          taskServiceClient.updateTaskStatusDeferred(
            updateTaskStatusDeferredRequest,
          ),
        );

        await expect(
          firstValueFrom(
            taskServiceClient.updateTaskStatusDeclined(
              updateTaskStatusDeclinedRequest,
            ),
          ),
        ).rejects.toThrowError(Error);

        await firstValueFrom(
          taskServiceClient.updateTaskStatusInProgress(
            updateTaskStatusInProgressRequest,
          ),
        );
      });

      it('should not update task from status supposedly completed to status declined', async () => {
        await firstValueFrom(
          taskServiceClient.updateTaskStatusSupposedlyCompleted(
            updateTaskStatusSupposedlyCompletedRequest,
          ),
        );

        await expect(
          firstValueFrom(
            taskServiceClient.updateTaskStatusDeclined(
              updateTaskStatusDeclinedRequest,
            ),
          ),
        ).rejects.toThrowError(Error);

        await firstValueFrom(
          taskServiceClient.updateTaskStatusInProgress(
            updateTaskStatusInProgressRequest,
          ),
        );
      });

      it('should not update task from status completed to status declined', async () => {
        await firstValueFrom(
          taskServiceClient.updateTaskStatusCompleted(
            updateTaskStatusCompletedRequest,
          ),
        );

        await expect(
          firstValueFrom(
            taskServiceClient.updateTaskStatusDeclined(
              updateTaskStatusDeclinedRequest,
            ),
          ),
        ).rejects.toThrowError(Error);

        await firstValueFrom(
          taskServiceClient.updateTaskStatusInProgress(
            updateTaskStatusInProgressRequest,
          ),
        );
      });

      it('should delete task', async () => {
        const result = await firstValueFrom(
          taskServiceClient.deleteTask({ id: taskId }),
        );

        expect(result).toEqual({});
        await expect(
          firstValueFrom(
            taskServiceClient.getTask({
              b24TaskId,
            }),
          ),
        ).rejects.toThrowError(Error);
      });

      // Cascade delete

      it('should delete task and cascade delete result, result data, result answer, verification, responsible history, status history', async () => {
        const taskEntity = await taskRepository.save({
          b24Id: 10,
          startDate: date.toISOString(),
          endDate: new Date(date.setDate(date.getDate() + 1)).toISOString(),
          estimateByUser: 1,
          userResponsibleId: 1,
          taskType: { id: 1 },
          taskWorkType: { id: 1 },
          taskStatus: { id: 1 },
        });

        const resultEntity = await taskResultRepository.save({
          description: '',
          task: taskEntity,
          userCreatorId: 1,
        });

        const resultDataEntity = await taskResultDataRepository.save({
          type: TypeEnum.LINK as unknown as Type, // TODO: fix it
          value: 'www.test.com',
          taskResult: resultEntity,
          isConfirmed: false,
          description: 'test',
        });

        const resultAnswerEntity = await taskResultAnswerRepository.save({
          description: 'test',
          taskResult: resultEntity,
          taskResultAnswerType: { id: 1 },
          userCreatorId: 1,
        });

        const verificationEntity = await taskVerificationRepository.save({
          task: taskEntity,
          userCreatorId: 1,
          link: 'www.test.com',
          taskVerificationType: { id: 1 },
          description: 'test',
        });

        const responsibleHistoryEntity =
          await taskResponsibleHistoryRepository.save({
            previousValue: 1,
            newValue: 2,
            task: taskEntity,
            userCreatorId: 1,
            description: 'test',
          });

        const statusHistoryEntity = await taskStatusHistoryRepository.save({
          userCreatorId: 1,
          previousStatus: { id: 1 },
          newStatus: { id: 2 },
          task: taskEntity,
          description: 'test',
          taskStatusReason: { id: 1 },
        });

        await firstValueFrom(
          taskServiceClient.deleteTask({ id: taskEntity.id }),
        );

        const deletedTaskEntity = await taskRepository.findOne({
          where: { id: taskEntity.id },
        });

        const deletedResultEntity = await taskResultRepository.findOne({
          where: { id: resultEntity.id },
        });

        const deletedResultDataEntity = await taskResultDataRepository.findOne({
          where: { id: resultDataEntity.id },
        });

        const deletedResultAnswerEntity =
          await taskResultAnswerRepository.findOne({
            where: { id: resultAnswerEntity.id },
          });

        const deletedVerificationEntity =
          await taskVerificationRepository.findOne({
            where: { id: verificationEntity.id },
          });

        const deletedResponsibleHistoryEntity =
          await taskResponsibleHistoryRepository.findOne({
            where: { id: responsibleHistoryEntity.id },
          });

        const deletedStatusHistoryEntity =
          await taskStatusHistoryRepository.findOne({
            where: { id: statusHistoryEntity.id },
          });

        expect(deletedTaskEntity).toBeNull();
        expect(deletedResultEntity).toBeNull();
        expect(deletedResultDataEntity).toBeNull();
        expect(deletedResultAnswerEntity).toBeNull();
        expect(deletedVerificationEntity).toBeNull();
        expect(deletedResponsibleHistoryEntity).toBeNull();
        expect(deletedStatusHistoryEntity).toBeNull();
      });
    });

    // TaskStatusReason

    describe('TaskStatusReason', () => {
      const createTaskStatusReasonRequest = {
        name: 'test',
        key: 'test',
        icon: 'test',
        color: 'test',
        description: 'test',
        failWeight: 1,
        taskStatusId: 1,
      };

      let taskStatusReasonId;

      it('should create task status reason', async () => {
        const result = await firstValueFrom(
          taskServiceClient.createTaskStatusReason(
            createTaskStatusReasonRequest,
          ),
        );
        const {
          id,
          name,
          key,
          icon,
          color,
          description,
          failWeight,
          createdAt,
          updatedAt,
        } = result;

        taskStatusReasonId = id;

        expect(result).toBeDefined();
        expect(id).toBeDefined();
        expect({
          name,
          key,
          icon,
          color,
          description,
          failWeight,
          taskStatusId: createTaskStatusReasonRequest.taskStatusId,
        }).toEqual(createTaskStatusReasonRequest);
        expect(new Date(createdAt).toISOString()).toBeDefined();
        expect(new Date(updatedAt).toISOString()).toBeDefined();
      });

      it('should get task status reason', async () => {
        const result = await firstValueFrom(
          taskServiceClient.getTaskStatusReason({ id: taskStatusReasonId }),
        );
        const {
          id,
          name,
          key,
          icon,
          color,
          description,
          failWeight,
          createdAt,
          updatedAt,
        } = result;
        expect(result).toBeDefined();
        expect(id).toBeDefined();
        expect({
          name,
          key,
          icon,
          color,
          description,
          failWeight,
          taskStatusId: createTaskStatusReasonRequest.taskStatusId,
        }).toEqual(createTaskStatusReasonRequest);
        expect(new Date(createdAt).toISOString()).toBeDefined();
        expect(new Date(updatedAt).toISOString()).toBeDefined();
      });

      it('should get task status reasons', async () => {
        const { result, total, limit, offset } = await firstValueFrom(
          taskServiceClient.getTaskStatusReasons({}),
        );
        const {
          id,
          name,
          key,
          icon,
          color,
          description,
          failWeight,
          createdAt,
          updatedAt,
        } = result.find(
          (taskStatusReason) => taskStatusReason.id === taskStatusReasonId,
        );
        expect(result).toBeDefined();
        expect(id).toBeDefined();
        expect(result.length).toBeGreaterThanOrEqual(19);
        expect(total).toBeGreaterThanOrEqual(19);
        expect(limit).toEqual(0);
        expect(offset).toEqual(0);
        expect({
          name,
          key,
          icon,
          color,
          description,
          failWeight,
          taskStatusId: createTaskStatusReasonRequest.taskStatusId,
        }).toEqual(createTaskStatusReasonRequest);
        expect(new Date(createdAt).toISOString()).toBeDefined();
        expect(new Date(updatedAt).toISOString()).toBeDefined();
      });

      it('should get task status reasons, limit', async () => {
        const { result, total, limit, offset } = await firstValueFrom(
          taskServiceClient.getTaskStatusReasons({
            offset: 13,
            limit: 1,
          }),
        );
        expect(result).toBeDefined();
        expect(total).toBeGreaterThanOrEqual(14);
        expect(limit).toEqual(1);
        expect(offset).toEqual(13);
      });

      it('should update task status reason', async () => {
        const updateTaskStatusReasonRequest = {
          id: taskStatusReasonId,
          name: 'test2',
          icon: 'test2',
          color: 'test2',
          description: 'test2',
          failWeight: 2,
        };
        const result = await firstValueFrom(
          taskServiceClient.updateTaskStatusReason(
            updateTaskStatusReasonRequest,
          ),
        );
        const { id, name, icon, color, description, failWeight, updatedAt } =
          result;
        expect(result).toBeDefined();
        expect(id).toBeDefined();
        expect({
          id,
          name,
          icon,
          color,
          description,
          failWeight,
        }).toEqual(updateTaskStatusReasonRequest);
        expect(new Date(updatedAt).toISOString()).toBeDefined();
      });

      it('should delete task status reason', async () => {
        const result = await firstValueFrom(
          taskServiceClient.deleteTaskStatusReason({ id: taskStatusReasonId }),
        );
        expect(result).toEqual({});
        await expect(
          firstValueFrom(
            taskServiceClient.getTaskStatusReason({ id: taskStatusReasonId }),
          ),
        ).rejects.toThrowError(Error);
      });

      it('should not update task status reason if data is seed', async () => {
        const taskStatusReasons = await taskStatusReasonRepository.find();
        /* eslint-disable-next-line */
        for await (const taskStatusReason of taskStatusReasons) {
          if (
            Object.values(TaskStatusReasonEnum).includes(
              taskStatusReason.key as TaskStatusReasonEnum,
            )
          ) {
            await expect(
              firstValueFrom(
                taskServiceClient.updateTaskStatusReason(taskStatusReason),
              ),
            ).rejects.toThrow('is seeded and cannot be updated');
          }
        }
      });

      it('should not delete task status reason if data is seed', async () => {
        const taskStatusReasons = await taskStatusReasonRepository.find();
        /* eslint-disable-next-line */
        for await (const taskStatusReason of taskStatusReasons) {
          if (
            Object.values(TaskStatusReasonEnum).includes(
              taskStatusReason.key as TaskStatusReasonEnum,
            )
          ) {
            await expect(
              firstValueFrom(
                taskServiceClient.deleteTaskStatusReason(taskStatusReason),
              ),
            ).rejects.toThrow('is seeded and cannot be deleted');
          }
        }
      });
    });

    // TaskType

    describe('TaskType', () => {
      const createTaskTypeRequest = {
        name: 'test',
        key: 'test',
        icon: 'test',
        color: 'test',
        description: 'test',
      };
      let taskTypeId;

      it('should create task type', async () => {
        const result = await firstValueFrom(
          taskServiceClient.createTaskType(createTaskTypeRequest),
        );

        const {
          id,
          name,
          key,
          icon,
          color,
          description,
          createdAt,
          updatedAt,
        } = result;
        taskTypeId = id;

        expect(result).toBeDefined();
        expect(id).toBeDefined();
        expect({
          name,
          key,
          icon,
          color,
          description,
        }).toEqual(createTaskTypeRequest);
        expect(new Date(createdAt).toISOString()).toBeDefined();
        expect(new Date(updatedAt).toISOString()).toBeDefined();
      });

      it('should get task type', async () => {
        const result = await firstValueFrom(
          taskServiceClient.getTaskType({ id: taskTypeId }),
        );

        const {
          id,
          name,
          key,
          icon,
          color,
          description,
          createdAt,
          updatedAt,
        } = result;

        expect(result).toBeDefined();
        expect(id).toBeDefined();
        expect({
          name,
          key,
          icon,
          color,
          description,
        }).toEqual(createTaskTypeRequest);
        expect(new Date(createdAt).toISOString()).toBeDefined();
        expect(new Date(updatedAt).toISOString()).toBeDefined();
      });

      it('should get task types', async () => {
        const { result, total, limit, offset } = await firstValueFrom(
          taskServiceClient.getTaskTypes({}),
        );

        const {
          id,
          name,
          key,
          icon,
          color,
          description,
          createdAt,
          updatedAt,
        } = result.find((taskType) => taskType.id === taskTypeId);

        expect(result).toBeDefined();
        expect(id).toBeDefined();
        expect(total).toBeGreaterThanOrEqual(6);
        expect(limit).toEqual(0);
        expect(offset).toEqual(0);
        expect({
          name,
          key,
          icon,
          color,
          description,
        }).toEqual(createTaskTypeRequest);
        expect(new Date(createdAt).toISOString()).toBeDefined();
        expect(new Date(updatedAt).toISOString()).toBeDefined();
      });

      it('should get task types, limit, offset', async () => {
        const { result, total, limit, offset } = await firstValueFrom(
          taskServiceClient.getTaskTypes({
            offset: 6,
            limit: 1,
          }),
        );

        expect(result).toBeDefined();
        expect(total).toBeGreaterThanOrEqual(6);
        expect(limit).toEqual(1);
        expect(offset).toEqual(6);
      });

      it('should update task type', async () => {
        const updateTaskTypeRequest = {
          id: taskTypeId,
          name: 'test2',
          icon: 'test2',
          color: 'test2',
          description: 'test2',
        };

        const result = await firstValueFrom(
          taskServiceClient.updateTaskType(updateTaskTypeRequest),
        );

        const { id, name, icon, color, description, updatedAt } = result;

        expect(result).toBeDefined();
        expect(id).toBeDefined();
        expect({
          id,
          name,
          icon,
          color,
          description,
        }).toEqual(updateTaskTypeRequest);
        expect(new Date(updatedAt).toISOString()).toBeDefined();
      });

      it('should delete task type', async () => {
        const result = await firstValueFrom(
          taskServiceClient.deleteTaskType({ id: taskTypeId }),
        );

        expect(result).toEqual({});
        await expect(
          firstValueFrom(taskServiceClient.getTaskType({ id: taskTypeId })),
        ).rejects.toThrowError(Error);
      });

      it('should not update task type if data is seed', async () => {
        const taskTypes = await taskTypeRepository.find();
        /* eslint-disable-next-line */
        for await (const taskType of taskTypes) {
          if (
            Object.values(TaskTypeEnum).includes(taskType.key as TaskTypeEnum)
          ) {
            await expect(
              firstValueFrom(taskServiceClient.updateTaskType(taskType)),
            ).rejects.toThrow('is seeded and cannot be updated');
          }
        }
      });

      it('should not delete task type if data is seed', async () => {
        const taskTypes = await taskTypeRepository.find();
        /* eslint-disable-next-line */
        for await (const taskType of taskTypes) {
          if (
            Object.values(TaskTypeEnum).includes(taskType.key as TaskTypeEnum)
          ) {
            await expect(
              firstValueFrom(taskServiceClient.deleteTaskType(taskType)),
            ).rejects.toThrow('is seeded and cannot be deleted');
          }
        }
      });
    });

    // TaskWorkType

    describe('TaskWorkType', () => {
      const createTaskWorkTypeRequest = {
        name: 'test',
        key: 'test',
        icon: 'test',
        color: 'test',
        description: 'test',
      };

      let taskWorkTypeId;

      it('should create task work type', async () => {
        const result = await firstValueFrom(
          taskServiceClient.createTaskWorkType(createTaskWorkTypeRequest),
        );

        const {
          id,
          name,
          key,
          icon,
          color,
          description,
          createdAt,
          updatedAt,
        } = result;
        taskWorkTypeId = id;

        expect(result).toBeDefined();
        expect(id).toBeDefined();
        expect({
          name,
          key,
          icon,
          color,
          description,
        }).toEqual(createTaskWorkTypeRequest);
        expect(new Date(createdAt).toISOString()).toBeDefined();
        expect(new Date(updatedAt).toISOString()).toBeDefined();
      });

      it('should get task work type', async () => {
        const result = await firstValueFrom(
          taskServiceClient.getTaskWorkType({ id: taskWorkTypeId }),
        );

        const {
          id,
          name,
          key,
          icon,
          color,
          description,
          createdAt,
          updatedAt,
        } = result;

        expect(result).toBeDefined();
        expect(id).toBeDefined();
        expect({
          name,
          key,
          icon,
          color,
          description,
        }).toEqual(createTaskWorkTypeRequest);
        expect(new Date(createdAt).toISOString()).toBeDefined();
        expect(new Date(updatedAt).toISOString()).toBeDefined();
      });

      it('should get task work types', async () => {
        const { result, total, limit, offset } = await firstValueFrom(
          taskServiceClient.getTaskWorkTypes({}),
        );

        const {
          id,
          name,
          key,
          icon,
          color,
          description,
          createdAt,
          updatedAt,
        } = result.find((taskWorkType) => taskWorkType.id === taskWorkTypeId);

        expect(result).toBeDefined();
        expect(id).toBeDefined();
        expect(total).toBeGreaterThanOrEqual(4);
        expect(limit).toEqual(0);
        expect(offset).toEqual(0);
        expect({
          name,
          key,
          icon,
          color,
          description,
        }).toEqual(createTaskWorkTypeRequest);
        expect(new Date(createdAt).toISOString()).toBeDefined();
        expect(new Date(updatedAt).toISOString()).toBeDefined();
      });

      it('should get task work types, limit, offset', async () => {
        const { result, total, limit, offset } = await firstValueFrom(
          taskServiceClient.getTaskWorkTypes({
            offset: 4,
            limit: 1,
          }),
        );

        expect(result).toBeDefined();
        expect(total).toBeGreaterThanOrEqual(4);
        expect(limit).toEqual(1);
        expect(offset).toEqual(4);
      });

      it('should update task work type', async () => {
        const updateTaskWorkTypeRequest = {
          id: taskWorkTypeId,
          name: 'test2',
          icon: 'test2',
          color: 'test2',
          description: 'test2',
        };

        const result = await firstValueFrom(
          taskServiceClient.updateTaskWorkType(updateTaskWorkTypeRequest),
        );

        const { id, name, icon, color, description, updatedAt } = result;

        expect(result).toBeDefined();
        expect(id).toBeDefined();
        expect({
          id,
          name,
          icon,
          color,
          description,
        }).toEqual(updateTaskWorkTypeRequest);
        expect(new Date(updatedAt).toISOString()).toBeDefined();
      });

      it('should delete task work type', async () => {
        const result = await firstValueFrom(
          taskServiceClient.deleteTaskWorkType({ id: taskWorkTypeId }),
        );

        expect(result).toEqual({});
        await expect(
          firstValueFrom(
            taskServiceClient.getTaskWorkType({ id: taskWorkTypeId }),
          ),
        ).rejects.toThrowError(Error);
      });

      it('should not update task work type if data is seed', async () => {
        const taskWorkTypes = await taskWorkTypeRepository.find();
        /* eslint-disable-next-line */
        for await (const taskWorkType of taskWorkTypes) {
          if (
            Object.values(TaskWorkTypeEnum).includes(
              taskWorkType.key as TaskWorkTypeEnum,
            )
          ) {
            await expect(
              firstValueFrom(
                taskServiceClient.updateTaskWorkType(taskWorkType),
              ),
            ).rejects.toThrow('is seeded and cannot be updated');
          }
        }
      });

      it('should not delete task work type if data is seed', async () => {
        const taskWorkTypes = await taskWorkTypeRepository.find();
        /* eslint-disable-next-line */
        for await (const taskWorkType of taskWorkTypes) {
          if (
            Object.values(TaskWorkTypeEnum).includes(
              taskWorkType.key as TaskWorkTypeEnum,
            )
          ) {
            await expect(
              firstValueFrom(
                taskServiceClient.deleteTaskWorkType(taskWorkType),
              ),
            ).rejects.toThrow('is seeded and cannot be deleted');
          }
        }
      });
    });

    // TaskStatus

    describe('TaskStatus', () => {
      const createTaskStatusRequest = {
        name: 'test',
        key: 'test',
        icon: 'test',
        color: 'test',
        description: 'test',
        isNeedChangeResponsible: false,
      };

      let taskStatusId;

      it('should create task status', async () => {
        const result = await firstValueFrom(
          taskServiceClient.createTaskStatus(createTaskStatusRequest),
        );

        const {
          id,
          name,
          key,
          icon,
          color,
          description,
          isNeedChangeResponsible,
          createdAt,
          updatedAt,
        } = result;

        taskStatusId = id;

        expect(result).toBeDefined();
        expect(id).toBeDefined();
        expect({
          name,
          key,
          icon,
          color,
          description,
          isNeedChangeResponsible,
        }).toEqual(createTaskStatusRequest);
        expect(new Date(createdAt).toISOString()).toBeDefined();
        expect(new Date(updatedAt).toISOString()).toBeDefined();
      });

      it('should get task status', async () => {
        const result = await firstValueFrom(
          taskServiceClient.getTaskStatus({ id: taskStatusId }),
        );

        const {
          id,
          name,
          key,
          icon,
          color,
          description,
          isNeedChangeResponsible,
          createdAt,
          updatedAt,
        } = result;

        expect(result).toBeDefined();
        expect(id).toBeDefined();
        expect({
          name,
          key,
          icon,
          color,
          description,
          isNeedChangeResponsible,
        }).toEqual(createTaskStatusRequest);
        expect(new Date(createdAt).toISOString()).toBeDefined();
        expect(new Date(updatedAt).toISOString()).toBeDefined();
      });

      it('should get task statuses', async () => {
        const { result, total, limit, offset } = await firstValueFrom(
          taskServiceClient.getTaskStatuses({}),
        );

        const {
          id,
          name,
          key,
          icon,
          color,
          description,
          isNeedChangeResponsible,
          createdAt,
          updatedAt,
        } = result.find((taskStatus) => taskStatus.id === taskStatusId);

        expect(result).toBeDefined();
        expect(id).toBeDefined();
        expect(result.length).toEqual(6);
        expect(total).toEqual(6);
        expect(limit).toEqual(0);
        expect(offset).toEqual(0);
        expect({
          name,
          key,
          icon,
          color,
          description,
          isNeedChangeResponsible,
        }).toEqual(createTaskStatusRequest);
        expect(new Date(createdAt).toISOString()).toBeDefined();
        expect(new Date(updatedAt).toISOString()).toBeDefined();
      });

      it('should get task statuses, limit, offset', async () => {
        const { result, total, limit, offset } = await firstValueFrom(
          taskServiceClient.getTaskStatuses({
            offset: 6,
            limit: 1,
          }),
        );

        expect(result).toBeDefined();
        expect(total).toBeGreaterThanOrEqual(6);
        expect(limit).toEqual(1);
        expect(offset).toEqual(6);
      });

      it('should update task status', async () => {
        const updateTaskStatusRequest = {
          id: taskStatusId,
          name: 'test2',
          icon: 'test2',
          color: 'test2',
          description: 'test2',
        };

        const result = await firstValueFrom(
          taskServiceClient.updateTaskStatus(updateTaskStatusRequest),
        );

        const { id, name, icon, color, description, updatedAt } = result;

        expect(result).toBeDefined();
        expect(id).toBeDefined();
        expect({
          id,
          name,
          icon,
          color,
          description,
        }).toEqual(updateTaskStatusRequest);
        expect(new Date(updatedAt).toISOString()).toBeDefined();
      });

      it('should delete task status', async () => {
        const result = await firstValueFrom(
          taskServiceClient.deleteTaskStatus({ id: taskStatusId }),
        );

        expect(result).toEqual({});
        await expect(
          firstValueFrom(taskServiceClient.getTaskStatus({ id: taskStatusId })),
        ).rejects.toThrowError(Error);
      });

      it('should not update task status if data is seed', async () => {
        const taskStatuses = await taskStatusRepository.find();
        /* eslint-disable-next-line */
        for await (const taskStatus of taskStatuses) {
          if (
            Object.values(TaskStatusEnum).includes(
              taskStatus.key as TaskStatusEnum,
            )
          ) {
            await expect(
              firstValueFrom(taskServiceClient.updateTaskStatus(taskStatus)),
            ).rejects.toThrow('is seeded and cannot be updated');
          }
        }
      });

      it('should not delete task status if data is seed', async () => {
        const taskStatuses = await taskStatusRepository.find();
        /* eslint-disable-next-line */
        for await (const taskStatus of taskStatuses) {
          if (
            Object.values(TaskStatusEnum).includes(
              taskStatus.key as TaskStatusEnum,
            )
          ) {
            await expect(
              firstValueFrom(taskServiceClient.deleteTaskStatus(taskStatus)),
            ).rejects.toThrow('is seeded and cannot be deleted');
          }
        }
      });
    });
  });
});
