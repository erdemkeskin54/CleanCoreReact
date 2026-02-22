import { describe, it, expect } from 'vitest';
import { ok, err, errorFactory, type Result } from '@domain/shared/Result';

describe('Result pattern', () => {
  it('ok() success state üretiyor', () => {
    const r: Result<number> = ok(42);
    expect(r.isSuccess).toBe(true);
    expect(r.isFailure).toBe(false);
    if (r.isSuccess) expect(r.value).toBe(42);
  });

  it('err() failure state üretiyor', () => {
    const error = errorFactory.notFound('Test.NotFound', 'Bulunamadı');
    const r: Result<number> = err(error);
    expect(r.isSuccess).toBe(false);
    expect(r.isFailure).toBe(true);
    if (r.isFailure) {
      expect(r.error.code).toBe('Test.NotFound');
      expect(r.error.type).toBe('NotFound');
    }
  });

  it('errorFactory tüm tipleri doğru üretiyor', () => {
    expect(errorFactory.validation('a', 'b').type).toBe('Validation');
    expect(errorFactory.conflict('a', 'b').type).toBe('Conflict');
    expect(errorFactory.unauthorized('a', 'b').type).toBe('Unauthorized');
    expect(errorFactory.forbidden('a', 'b').type).toBe('Forbidden');
    expect(errorFactory.failure('a', 'b').type).toBe('Failure');
  });
});
