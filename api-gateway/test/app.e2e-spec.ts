


import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, CACHE_MODULE_OPTIONS, HttpStatus, ExecutionContext, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import jwtDecode from 'jwt-decode';
import { stringify } from 'querystring';
import { AuthGuard } from '../src/auth/auth.guard';

let adminToken: string
const adminUserId = 1
const someExistingUserId = 2
const someNonexistingUserId = Date.now() % 10 ** 9
const invalidAuthHeader = 'wqdjipd'
const invalidAuthToken = 'sdfwdvwevwev'

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService

  beforeEach(async () => {


    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // Из за ошибки "at ../node_modules/@nestjs/platform-fastify/adapters/fastify-adapter.js:301:58"
      // Ошибка связана с использованием CacheModule в app.module.ts
      // Нужно использовать функцию overrideProvider
      // Взято из https://stackoverflow.com/questions/71169241/mock-redis-in-jest-nestjs
      .overrideProvider(CACHE_MODULE_OPTIONS)
      .useValue({})
      .compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    app.useGlobalPipes(new ValidationPipe())

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    
    authService = moduleFixture.get<AuthService>(AuthService);
    adminToken = (await authService.signInAsUser({userId: adminUserId})).token
    console.log('admin token: ' + adminToken)
  }, 30_000);

  afterAll(async () => {
    await app.close();
  });

  

  it('/healthz (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/healthz').set('Authorization', `Bearer ${adminToken}`).expect(200);
    expect(res.body.authHealth.status).toEqual(expect.any(Number));
    expect(res.body.userHealth.status).toEqual(expect.any(Number));
    expect(res.body.b24SyncHealth.status).toEqual(expect.any(Number));
    expect(res.body.fileHealth.status).toEqual(expect.any(Number));
    expect(res.body.firmwareHealth.status).toEqual(expect.any(Number));
    expect(res.body.retrospectiveHealth.status).toEqual(expect.any(Number));
    expect(res.body.crmHealth.status).toEqual(expect.any(Number));
    expect(res.body.taskHealth.status).toEqual(expect.any(Number));
    expect(res.body.parserApiHealth.status).toEqual(expect.any(Number));
  });

  describe('GET /auth/getLink', () => {
    
    it('getLink should return link', async () => {
      const res = await request(app.getHttpServer())
        .get('/auth/getLink')
        .query({ env: 'local' })
        .expect(200);
  
      console.log(res.body);
  
      expect(res.body.link).toEqual(expect.any(String));
    });

    it('should handle missing or invalid env parameter', async () => {
      const emptyEnvResponse = await request(app.getHttpServer())
        .get('/auth/getLink')
        .expect(HttpStatus.BAD_REQUEST);

      // expect(emptyEnvResponse.body).toHaveProperty('message', [
      //   'env should not be empty',
      //   'env must be one of the following values: prod, local, dev',
      // ]);

      const wrongEnvResponse = await request(app.getHttpServer())
        .get('/auth/getLink')
        .query({ env: 'invalid' })
        .expect(HttpStatus.BAD_REQUEST);

      // expect(wrongEnvResponse.body).toHaveProperty('message', [
      //   'env must be one of the following values: prod, local, dev',
      // ]);
    });

    it('should handle failure in the auth microservice', async () => {
      jest.spyOn(authService, 'getLink').mockRejectedValueOnce(new Error('Service unavailable'));

      const serviceUnavailableResponse = await request(app.getHttpServer())
        .get('/auth/getLink')
        .query({ env: 'local' })
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);

      expect(serviceUnavailableResponse.body).toHaveProperty('message', 'Internal server error');
    });
  });


  describe('POST /auth/signInAsUser', () => {
    it('should return valid token for existing user', async () => {
      const signInAsUserRes = await request(app.getHttpServer())
        .post('/auth/signInAsUser')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ userId: someExistingUserId})
        .expect(HttpStatus.CREATED); //TODO - change status

      const signInAsUserJwt = signInAsUserRes.body.token
      const decoded: {id: string, userId: string} = jwtDecode(signInAsUserJwt)

      expect(decoded.id).toEqual(someExistingUserId);
      expect(decoded.userId).toEqual(someExistingUserId);
    });

    it('should work if user doesnt exist', async () => {
      const signInAsUserRes = await request(app.getHttpServer())
        .post('/auth/signInAsUser')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({userId: someNonexistingUserId})
        .expect(HttpStatus.CREATED)

      const signInAsUserJwt = signInAsUserRes.body.token
      const decoded: {id: string, userId: string} = jwtDecode(signInAsUserJwt)

      expect(decoded.id).toEqual(someNonexistingUserId);
      expect(decoded.userId).toEqual(someNonexistingUserId);
    })

    //ask Mykyta
    it('should handle invalid auth',async () => {
      const signInAsUserRes = await request(app.getHttpServer())
        .post('/auth/signInAsUser')
        .set('Authorization', invalidAuthHeader)
        .send({ userId: someExistingUserId})
        .expect(HttpStatus.FORBIDDEN)
    })

    it('should handle missing or invalid request body', async () => {
      const missingBodyResponse = await request(app.getHttpServer())
        .post('/auth/signInAsUser')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(HttpStatus.BAD_REQUEST);

      // expect(missingBodyResponse.body).toHaveProperty('message', [
      //   'userId should not be empty',
      // ]);

      const invalidBodyResponse = await request(app.getHttpServer())
        .post('/auth/signInAsUser')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ userId: 'invalid' })
        .expect(HttpStatus.BAD_REQUEST);

      // expect(invalidBodyResponse.body).toHaveProperty('message', [
      //   'userId must be an integer number',
      // ]);
    });
  })

  describe('POST /auth/verify', () => {
    it('verify should return true when valid token', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/verify')
        .send({ token: adminToken })
        .expect(HttpStatus.CREATED);

      console.log(res.body);

      expect(res.body.isValid).toEqual(true)
    });

    it('verify should return false when invalid token', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/verify')
        .send({ token: invalidAuthToken })
        .expect(HttpStatus.CREATED);

      console.log(res.body);

      expect(res.body.isValid).toEqual(false)
    });


    it('should handle missing or invalid request body', async () => {
      const missingBodyResponse = await request(app.getHttpServer())
        .post('/auth/verify')
        .send()
        .expect(HttpStatus.BAD_REQUEST);

      // expect(missingBodyResponse.body).toHaveProperty('message', [
      //   'token should not be empty',
      // ]);

      const invalidBodyResponse = await request(app.getHttpServer())
        .post('/auth/verify')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);

      // expect(invalidBodyResponse.body).toHaveProperty('message', [
      //   'token must be a string',
      // ]);
    });
  })

});



  // it('getLink should not return link when unknown env passed', async () => {
  //   const res = await request(app.getHttpServer())
  //     .get('/auth/getLink')
  //     .query({ env: 'bad' })
  //     .expect(200);

  //   console.log(res.body);

  //   expect(res.body.link).toEqual(expect.any(String));
  // });

  


