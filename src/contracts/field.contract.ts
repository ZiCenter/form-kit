import type { BaseField } from '../models/Field/Field';

// `any` for TSchema and TConfig in this alias is intentional: each subclass narrows
// TSchema to a specific zod type (e.g. ZodString for TextField), and a wider alias
// would reject subclass instances due to contravariance on the `validation` callback.
export type Field<TOutput = any> = BaseField<TOutput, any, any>;
