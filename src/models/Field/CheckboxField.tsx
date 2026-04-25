import type { FC } from 'react';
import { z } from 'zod/v4';
import type { CheckboxFieldConfig } from '../../contracts/checkbox-field.contract';
import type { FormFieldRenderProps } from '../../contracts/field-renderer.contract';
import { useFormFieldSlots } from '../../providers/FormFieldProvider';
import { BaseField } from './Field';

export class CheckboxField<
  const TConfig extends CheckboxFieldConfig = CheckboxFieldConfig,
> extends BaseField<boolean, z.ZodBoolean, TConfig> {
  readonly alwaysOptional = true as const;

  constructor(config: TConfig) {
    super(config);
  }

  protected buildBaseSchema(): z.ZodBoolean {
    return z.boolean();
  }

  protected applyCoercion(schema: z.ZodTypeAny): z.ZodTypeAny {
    return z.preprocess((v) => (typeof v === 'string' ? v === 'true' : v), schema);
  }

  Renderer: FC<FormFieldRenderProps<CheckboxField>> = (props) => {
    const { checkbox: Slot } = useFormFieldSlots();
    return <Slot {...props} />;
  };
}
