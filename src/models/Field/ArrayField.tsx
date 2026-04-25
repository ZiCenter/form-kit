import type { FC } from 'react';
import { z } from 'zod/v4';
import type { Field } from '../../contracts/field.contract';
import type { FormFieldRenderProps } from '../../contracts/field-renderer.contract';
import { useFormFieldSlots } from '../../providers/FormFieldProvider';
import { BaseField, type FieldBaseConfig } from './Field';

type ArraySchema = z.ZodArray<z.ZodObject<any>>;

interface ArrayFieldConfig extends FieldBaseConfig<ArraySchema, Record<string, any>[]> {
  /** Fields rendered for each item in the array. */
  itemFields: Field[];
  minItems?: number;
  maxItems?: number;
  /** Label for the add-row button. Defaults to "Add". */
  addLabel?: string;
  /** Text shown when the array is empty. */
  emptyLabel?: string;
  /** Default values applied to a newly-added row. */
  newItemDefaults?: Record<string, any>;
}

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
