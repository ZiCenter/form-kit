import type { FC } from 'react';
import { z } from 'zod/v4';
import type { ArrayFieldConfig } from '../../contracts/array-field.contract';
import type { Field } from '../../contracts/field.contract';
import type { FormFieldRenderProps } from '../../contracts/field-renderer.contract';
import type { ArraySchema } from '../../types/field-schemas';
import { useFormFieldSlots } from '../../providers/FormFieldProvider';
import { BaseField } from './Field';

export class ArrayField<
  const TConfig extends ArrayFieldConfig = ArrayFieldConfig,
> extends BaseField<Record<string, any>[], ArraySchema, TConfig> {
  readonly alwaysOptional = true as const;
  readonly itemFields: Field[];
  readonly minItems?: number;
  readonly maxItems?: number;
  readonly addLabel?: string;
  readonly emptyLabel?: string;
  readonly newItemDefaults?: Record<string, any>;

  constructor(config: TConfig) {
    super(config);
    this.itemFields = config.itemFields;
    this.minItems = config.minItems;
    this.maxItems = config.maxItems;
    this.addLabel = config.addLabel;
    this.emptyLabel = config.emptyLabel;
    this.newItemDefaults = config.newItemDefaults;
  }

  protected buildBaseSchema(): ArraySchema {
    const itemShape: Record<string, z.ZodTypeAny> = {};
    for (const inner of this.itemFields) {
      itemShape[inner.key] = inner.buildFieldSchema();
    }
    let schema: ArraySchema = z.array(z.object(itemShape));
    if (this.minItems != null) schema = schema.min(this.minItems);
    if (this.maxItems != null) schema = schema.max(this.maxItems);
    return schema;
  }

  Renderer: FC<FormFieldRenderProps<ArrayField>> = (props) => {
    const { array: Slot } = useFormFieldSlots();
    return <Slot {...props} />;
  };
}
