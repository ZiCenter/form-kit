import type { MultiAutocompleteSchema } from '../types/field-schemas';
import type { FieldBaseConfig, OptionConfig } from './field.contract';

export interface MultiAutocompleteFieldConfig<TOption = any>
  extends FieldBaseConfig<MultiAutocompleteSchema, (string | number)[]>,
    OptionConfig<TOption> {
  search: (query: string) => Promise<any[]>;
  asyncMinChars?: number;
}
