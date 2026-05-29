import { Controller, Get } from '@nestjs/common';
import { HelloService } from './hello.service';

@Controller('hello')
export class HelloController {
  constructor(private readonly helloService: HelloService) {}

  @Get()
  getCode(): { code: string } {
    return { code: this.helloService.generateCode() };
  }
}
