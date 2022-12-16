import { Injectable, PipeTransform } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

@Injectable()
export class MathExpressionValidationPipe implements PipeTransform<any> {
  private readonly mathExpressionRegex = /^[\d\+\-\*\/\(\)\s]+$/;

  transform(value: any) {
    if (!value) {
      throw new BadRequestException('`query` is required');
    }

    if (!this.isValidBase64(value)) {
      throw new BadRequestException('`query` must be base 64 encoded');
    }

    const decodedValue = Buffer.from(value, 'base64').toString('utf8');
    if (!this.mathExpressionRegex.test(decodedValue)) {
      throw new BadRequestException(
        '`query` must only contain numbers and the following operators: +, -, *, /, (, )',
      );
    }

    return decodedValue;
  }

  private isValidBase64(value: any) {
    return Buffer.from(value, 'base64').toString('base64') === value;
  }
}
