import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { MathExpressionValidationPipe } from './pipes/math-expression-validation.pipe';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('calculus')
  getCalculus(
    @Query('query', new MathExpressionValidationPipe()) query: string,
  ) {
    return {
      error: false,
      result: this.appService.evaluateMathExpression(query),
    };
  }

  @Get('calculus/history')
  getCalculusHistory() {
    return {
      error: false,
      history: this.appService.getHistory(),
    };
  }
}
