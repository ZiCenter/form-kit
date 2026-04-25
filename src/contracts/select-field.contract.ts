import type { SelectSchema } from '../types/field-schemas';
import type { FieldBaseConfig, OptionConfig } from './field.contract';

export interface SelectFieldConfig<TOption = any>
  extends FieldBaseConfig<SelectSchema, string | number>,
    OptionConfig<TOption> {
  options: () => Promise<TOption[]>;
  dependsOn?: string;
}
