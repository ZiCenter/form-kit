import type { z } from 'zod/v4';
import type { FieldBaseConfig } from './field.contract';

export interface FileFieldConfig extends FieldBaseConfig<z.ZodType<File>, File> {
  /** MIME filter passed to the <input type="file"> accept attribute. */
  accept?: string;
  /** Maximum file size in bytes. */
  maxSize?: number;
}
