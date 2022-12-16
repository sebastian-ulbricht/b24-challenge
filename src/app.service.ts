import { BadRequestException, Injectable } from '@nestjs/common';
import { evaluate } from 'mathjs';

type History = {
  query: string;
  result: number;
}[];

@Injectable()
export class AppService {
  private history: History = [];

  evaluateMathExpression(expression: string): number {
    try {
      const result = evaluate(expression);

      this.history.push({
        query: expression,
        result,
      });
      this.history = this.history.slice(-5);

      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  getHistory(): History {
    return this.history;
  }
}
