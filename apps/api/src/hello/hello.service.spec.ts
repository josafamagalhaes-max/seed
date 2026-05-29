import { Test, TestingModule } from '@nestjs/testing';
import { HelloService } from './hello.service';

describe('HelloService', () => {
  let service: HelloService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelloService],
    }).compile();

    service = module.get<HelloService>(HelloService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return exactly 6 numeric digits', () => {
    const code = service.generateCode();
    expect(code).toMatch(/^\d{6}$/);
  });

  it('should pad codes below 100000 with leading zeros', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    expect(service.generateCode()).toBe('000000');
    jest.restoreAllMocks();
  });

  it('should return different codes on consecutive calls', () => {
    const codes = new Set(
      Array.from({ length: 20 }, () => service.generateCode()),
    );
    expect(codes.size).toBeGreaterThan(1);
  });
});
