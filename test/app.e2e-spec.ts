import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AppService } from './../src/app.service';
import { ApiExceptionFilter } from './../src/filters/api-exception.filter';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new ApiExceptionFilter());
    await app.init();
  });

  it('/calculus (GET) - no query parameter', () => {
    return request(app.getHttpServer()).get('/calculus').expect(200).expect({
      error: true,
      message: '`query` is required',
    });
  });

  it('/calculus (GET) - query parameter is invalid input', () => {
    return request(app.getHttpServer())
      .get('/calculus')
      .query({ query: 'not base 64 encoded' })
      .expect(200)
      .expect({
        error: true,
        message: '`query` must be base 64 encoded',
      });
  });

  it('/calculus (GET) - query parameter is valid input', () => {
    return request(app.getHttpServer())
      .get('/calculus')
      .query({ query: 'MSArIDE=' }) // 1 + 1
      .expect(200)
      .expect({
        error: false,
        result: 2,
      });
  });

  it('/calculus/history (GET) - with empty history', () => {
    return request(app.getHttpServer())
      .get('/calculus/history')
      .expect(200)
      .expect({
        error: false,
        history: [],
      });
  });

  it('/calculus/history (GET) - with history', () => {
    const service = app.get(AppService);
    for (let i = 0; i < 5; i++) {
      service.evaluateMathExpression(`${i} + ${i}`);
    }

    return request(app.getHttpServer())
      .get('/calculus/history')
      .expect(200)
      .expect({
        error: false,
        history: [
          { query: '0 + 0', result: 0 },
          { query: '1 + 1', result: 2 },
          { query: '2 + 2', result: 4 },
          { query: '3 + 3', result: 6 },
          { query: '4 + 4', result: 8 },
        ],
      });
  });
});
