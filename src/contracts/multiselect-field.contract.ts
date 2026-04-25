import type { MultiselectSchema } from '../types/field-schemas';
import type { FieldBaseConfig, OptionConfig } from './field.contract';

export interface MultiselectFieldConfig<TOption = any>
  extends FieldBaseConfig<MultiselectSchema, (string | number)[]>,
    OptionConfig<TOption> {
  options: () => Promise<TOption[]>;
  dependsOn?: string;
}
