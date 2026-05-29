import { describe, expect, it, vi } from 'vitest';
import { HelloService } from './hello.service';

describe('HelloService', () => {
  const service = new HelloService();

  it('generates exactly 6 numeric digits', () => {
    expect(service.generateCode()).toMatch(/^\d{6}$/);
  });

  it('pads with leading zeros when Math.random returns 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(service.generateCode()).toBe('000000');
    vi.restoreAllMocks();
  });

  it('returns different codes on repeated calls', () => {
    const codes = new Set(Array.from({ length: 20 }, () => service.generateCode()));
    expect(codes.size).toBeGreaterThan(1);
  });
});
