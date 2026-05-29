import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloService {
  generateCode(): string {
    return Math.floor(Math.random() * 1_000_000)
      .toString()
      .padStart(6, '0');
  }
}
