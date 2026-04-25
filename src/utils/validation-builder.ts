import {z} from 'zod/v4';
import type {Field} from '../models/Field';

export function buildZodSchema(fields: readonly Field[]): z.ZodObject<any> {
    return z
        .object(
            fields.reduce((acc, cur) => ({...acc, [cur.key]: cur.buildFieldSchema()}), {})
        )
        .superRefine((data, ctx) => {
            fields.forEach(field => {
                const error = field.refine?.(data[field.key], data);
                if (error) ctx.addIssue({code: 'custom', path: [field.key], message: error});
            })
        });
}
