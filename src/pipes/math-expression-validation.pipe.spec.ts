import { Test } from '@nestjs/testing';
import { MathExpressionValidationPipe } from './math-expression-validation.pipe';

describe('MathExpressionValidationPipe', () => {
  let pipe: MathExpressionValidationPipe;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MathExpressionValidationPipe],
    }).compile();

    pipe = module.get<MathExpressionValidationPipe>(
      MathExpressionValidationPipe,
    );
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should throw an exception if the input is empty', () => {
    expect(() => pipe.transform('')).toThrowError('`query` is required');
  });

  it('should throw an exception if the input is not base64 encoded', () => {
    expect(() => pipe.transform('not base64 encoded')).toThrowError(
      '`query` must be base 64 encoded',
    );
  });

  it('should throw an exception if the input contains invalid characters', () => {
    expect(() =>
      pipe.transform(Buffer.from('1 + 1 = 2', 'utf8').toString('base64')),
    ).toThrowError(
      '`query` must only contain numbers and the following operators: +, -, *, /, (, )',
    );
  });

  it('should return the decoded value if the input is valid', () => {
    expect(
      pipe.transform(Buffer.from('1 + 1', 'utf8').toString('base64')),
    ).toBe('1 + 1');
  });
});
