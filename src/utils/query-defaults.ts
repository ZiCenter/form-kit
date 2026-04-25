import { z } from 'zod/v4';
import { ArrayField, FileField, type Field } from '../models/Field';

export function coerceQueryParams(
  params: URLSearchParams,
  fields: readonly Field[],
): Record<string, unknown> {
  const queryable = fields.filter(
    (f) => !(f instanceof FileField || f instanceof ArrayField),
  );
  const shape: Record<string, z.ZodTypeAny> = {};
  const raw: Record<string, string> = {};
  for (const field of queryable) {
    shape[field.key] = field.buildFieldSchema({ optional: true, forQuery: true });
    const value = params.get(field.key);
    if (value !== null) raw[field.key] = value;
  }
  const parsed = z.object(shape).partial().safeParse(raw);
  return parsed.success ? parsed.data : {};
}
