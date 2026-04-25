import type { z } from 'zod/v4';
import type { FieldBaseConfig } from './field.contract';

export type DateFieldConfig = FieldBaseConfig<z.ZodString, string>;
