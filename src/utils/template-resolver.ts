import type { OptionConfig } from '../models/Field';

export function mapRawOptions(
  rawOptions: any[],
  config: OptionConfig,
): { label: string; value: any }[] {
  const labelKey = config.optionLabel || 'name';
  const valueKey = config.optionValue || 'id';
  return rawOptions.map((opt: any) => ({
    label: String(opt[labelKey] ?? opt),
    value: opt[valueKey] ?? opt,
  }));
}
