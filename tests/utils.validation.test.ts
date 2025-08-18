import { z } from 'zod';
import { formatZodError } from '../src/utils/validation';

describe('utils/validation formatZodError', () => {
  it('formats single error', () => {
    const schema = z.object({ email: z.string().email('Please enter a valid email') });
    try {
      schema.parse({ email: 'bad' });
      fail('Expected schema to throw');
    } catch (e) {
      const { message, details } = formatZodError(e as z.ZodError);
      expect(message).toMatch(/valid email/);
      expect(details).toBeUndefined();
    }
  });

  it('formats multiple errors', () => {
    const schema = z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Please enter a valid email'),
    });
    try {
      schema.parse({ name: 'a', email: 'bad' });
      fail('Expected schema to throw');
    } catch (e) {
      const { message, details } = formatZodError(e as z.ZodError);
      expect(message).toMatch(/Validation failed/);
      expect(details).toBeDefined();
      expect(details?.length).toBeGreaterThanOrEqual(2);
    }
  });
});





