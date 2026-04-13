import type { FieldDef } from '../types';

export function coerceQueryParams(
  params: URLSearchParams,
  fields: readonly FieldDef[],
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const field of fields) {
    const raw = params.get(field.key);
    if (raw === null) continue;
    switch (field.type) {
      case 'number':
      case 'currency': {
        const n = Number(raw);
        if (!Number.isNaN(n)) result[field.key] = n;
        break;
      }
      case 'checkbox':
        result[field.key] = raw === 'true';
        break;
      case 'multiselect':
      case 'multi-autocomplete':
        result[field.key] = raw.split(',').filter(Boolean);
        break;
      default:
        result[field.key] = raw;
    }
  }
  return result;
}
