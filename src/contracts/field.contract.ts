import type { Field as FieldInterface } from '../models/Field/Field';

// `any` for TSchema and TConfig is intentional: each subclass narrows TSchema to a
// specific zod type (e.g. ZodString for TextField), and a wider parameterization
// would reject subclass instances due to contravariance on the `validation` callback.
export type Field<TOutput = any> = FieldInterface<TOutput, any, any>;
