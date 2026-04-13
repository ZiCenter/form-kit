import { z } from 'zod/v4';
import type { FieldDef } from '../types';

interface CrossFieldValidator {
  key: string;
  validator: (value: unknown, formValues: Record<string, unknown>) => boolean;
  message: string;
}

export function buildZodSchema(fields: readonly FieldDef[]): z.ZodObject<any> {
  const shape: Record<string, z.ZodTypeAny> = {};
  const crossFieldValidators: CrossFieldValidator[] = [];

  for (const field of fields) {
    let schema: z.ZodTypeAny;

    switch (field.type) {
      case 'number':
      case 'currency':
        schema = z.coerce.number();
        break;
      case 'checkbox':
        schema = z.boolean().optional();
        break;
      case 'multiselect':
      case 'multi-autocomplete':
        schema = z.array(z.any()).optional();
        break;
      case 'array': {
        const itemShape: Record<string, z.ZodTypeAny> = {};
        for (const inner of field.itemFields) {
          let innerSchema: z.ZodTypeAny;
          switch (inner.type) {
            case 'number':
            case 'currency':
              innerSchema = z.coerce.number();
              break;
            case 'checkbox':
              innerSchema = z.boolean().optional();
              break;
            case 'date':
              innerSchema = z.union([z.string(), z.date()]);
              break;
            default:
              innerSchema = z.any();
          }
          if (!inner.required && inner.type !== 'checkbox') {
            innerSchema = innerSchema.optional();
          }
          itemShape[inner.key] = innerSchema;
        }
        let arrSchema: z.ZodTypeAny = z.array(z.object(itemShape));
        if (field.minItems != null) arrSchema = (arrSchema as z.ZodArray<any>).min(field.minItems);
        if (field.maxItems != null) arrSchema = (arrSchema as z.ZodArray<any>).max(field.maxItems);
        schema = arrSchema.optional();
        break;
      }
      case 'date':
        schema = z.union([z.string(), z.date()]);
        break;
      case 'file':
        schema = z.instanceof(File);
        break;
      default:
        schema = z.string();
    }

    if (field.validation) {
      for (const rule of field.validation) {
        if (schema instanceof z.ZodString) {
          switch (rule.type) {
            case 'minLength':
              schema = schema.min(rule.value as number, rule.message);
              break;
            case 'maxLength':
              schema = schema.max(rule.value as number, rule.message);
              break;
            case 'pattern':
              schema = schema.regex(new RegExp(rule.value as string | RegExp), rule.message);
              break;
          }
        }
        if (schema instanceof z.ZodNumber) {
          switch (rule.type) {
            case 'min':
              schema = schema.min(rule.value as number, rule.message);
              break;
            case 'max':
              schema = schema.max(rule.value as number, rule.message);
              break;
          }
        }
        if (rule.type === 'custom' && rule.validator) {
          crossFieldValidators.push({
            key: field.key,
            validator: rule.validator,
            message: rule.message ?? 'Invalid value',
          });
        }
      }
    }

    if (!field.required && field.type !== 'checkbox' && field.type !== 'array') {
      schema = schema.optional();
    }

    shape[field.key] = schema;
  }

  const objectSchema = z.object(shape);

  if (crossFieldValidators.length === 0) return objectSchema;

  return objectSchema.superRefine((data, ctx) => {
    for (const { key, validator, message } of crossFieldValidators) {
      if (!validator(data[key], data)) {
        ctx.addIssue({ code: 'custom', path: [key], message });
      }
    }
  }) as unknown as z.ZodObject<any>;
}
