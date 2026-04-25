import type { ArraySchema } from '../types/field-schemas';
import type { Field, FieldBaseConfig } from './field.contract';

export interface ArrayFieldConfig
  extends FieldBaseConfig<ArraySchema, Record<string, any>[]> {
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
