import type { FC } from 'react';
import { z } from 'zod/v4';
import type { FormFieldRenderProps } from '../../contracts/field-renderer.contract';
import type { FileFieldConfig } from '../../contracts/file-field.contract';
import { useFormFieldSlots } from '../../providers/FormFieldProvider';
import { BaseField } from './Field';

export class FileField<
  const TConfig extends FileFieldConfig = FileFieldConfig,
> extends BaseField<File, z.ZodType<File>, TConfig> {
  readonly accept?: string;
  readonly maxSize?: number;

  constructor(config: TConfig) {
    super(config);
    this.accept = config.accept;
    this.maxSize = config.maxSize;
  }

  protected buildBaseSchema(): z.ZodType<File> {
    let schema: z.ZodType<File> = z.instanceof(File);
    if (this.maxSize != null) {
      const limit = this.maxSize;
      schema = schema.refine((f) => f.size <= limit, {
        message: `File must be ${limit} bytes or smaller`,
      });
    }
    if (this.accept) {
      const allowed = this.accept.split(',').map((s) => s.trim()).filter(Boolean);
      schema = schema.refine((f) => acceptsFile(f, allowed), {
        message: `File type must match: ${this.accept}`,
      });
    }
    return schema;
  }

  Renderer: FC<FormFieldRenderProps<FileField>> = (props) => {
    const { file: Slot } = useFormFieldSlots();
    return <Slot {...props} />;
  };
}

function acceptsFile(file: File, accepts: string[]): boolean {
  if (accepts.length === 0) return true;
  return accepts.some((pattern) => {
    if (pattern.startsWith('.')) {
      return file.name.toLowerCase().endsWith(pattern.toLowerCase());
    }
    if (pattern.endsWith('/*')) {
      const prefix = pattern.slice(0, -1);
      return file.type.startsWith(prefix);
    }
    return file.type === pattern;
  });
}
