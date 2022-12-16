import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('calculus', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });

    it('should return an object with an error property', () => {
      expect(appController.getCalculus('')).toHaveProperty('error');
    });

    it('should return an object with a result property', () => {
      expect(appController.getCalculus('')).toHaveProperty('result');
    });

    it('should return an object with an result property equal to 2', () => {
      expect(appController.getCalculus('1 + 1').result).toBe(2);
    });

    it('should return an object with an result property equal to "Infinity"', () => {
      expect(appController.getCalculus('1 / 0').result).toBe(Infinity);
    });

    it('should return an object with an result property equal to "undefined"', () => {
      expect(appController.getCalculus('').result).toBe(undefined);
    });
  });

  describe('calculus/history', () => {
    it('should return an object with an error property', () => {
      expect(appController.getCalculusHistory()).toHaveProperty('error');
    });

    it('should return an object with a history property', () => {
      expect(appController.getCalculusHistory()).toHaveProperty('history');
    });

    it('should return an object with an history property equal to an array', () => {
      expect(appController.getCalculusHistory().history).toBeInstanceOf(Array);
    });

    it('should return an object with an history property equal to an array of length 5', () => {
      for (let i = 0; i < 10; i++) {
        appController.getCalculus(`${i} + ${i}`);
      }
      expect(appController.getCalculusHistory().history).toHaveLength(5);
    });

    it('should return an object with an history property equal to an array and its items being in the right order', () => {
      for (let i = 0; i < 10; i++) {
        appController.getCalculus(`${i} + ${i}`);
      }
      expect(appController.getCalculusHistory().history).toMatchObject([
        { query: '5 + 5', result: 10 },
        { query: '6 + 6', result: 12 },
        { query: '7 + 7', result: 14 },
        { query: '8 + 8', result: 16 },
        { query: '9 + 9', result: 18 },
      ]);
    });
  });
});
