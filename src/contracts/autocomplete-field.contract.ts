import type { AutocompleteSchema } from '../types/field-schemas';
import type { FieldBaseConfig, OptionConfig } from './field.contract';

export interface AutocompleteFieldConfig<TOption = any>
  extends FieldBaseConfig<AutocompleteSchema, string | number>,
    OptionConfig<TOption> {
  search: (query: string) => Promise<any[]>;
  asyncMinChars?: number;
  dependsOn?: string;
}
