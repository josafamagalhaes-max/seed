import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HelloService } from './hello.service';

@ApiTags('hello')
@Controller('hello')
export class HelloController {
  constructor(private readonly helloService: HelloService) {}

  @Get()
  @ApiOkResponse({ schema: { example: { code: '482910' } } })
  getCode(): { code: string } {
    return { code: this.helloService.generateCode() };
  }
}
