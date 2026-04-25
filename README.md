# @zicenter/form-kit

Headless, class-driven form primitives for React. Instantiate field classes, hand them to `BasicForm` or `StepperForm`,
and the kit auto-builds a Zod schema, wires it to `react-hook-form`, and renders each field through slot components you
provide.

Designed to be fully visual-free: it ships **zero** styles, layout, or components with opinions about how inputs look.
You supply the field renderers and (for `StepperForm`) the stepper shell; `form-kit` handles schema generation,
validation, defaults, coercion, visibility, disabled state, and step orchestration.

Used as the form engine behind [`@zicenter/resource-kit`](https://github.com/ZiCenter/resource-kit).

## Install

Consumed as a git-based npm dependency:

```json
{
  "dependencies": {
    "@zicenter/form-kit": "github:ZiCenter/form-kit#main"
  }
}
```

On `pnpm install`, pnpm clones the repo and runs the `prepare` hook (`tsup`), so consumers always resolve against built
output in `dist/`.

To enable the `prepare` hook under pnpm, add to your workspace or root `package.json`:

```yaml
# pnpm-workspace.yaml
onlyBuiltDependencies:
    - '@zicenter/form-kit'
```

### Pinning

Use a commit SHA for reproducible installs once stable:

```json
"@zicenter/form-kit": "github:ZiCenter/form-kit#<commit-sha>"
```

`pnpm-lock.yaml` pins the resolved commit even with `#main`, so re-running `pnpm install` bumps it.

## Peer dependencies

| Package               | Version |
|-----------------------|---------|
| `react`               | `^19`   |
| `react-dom`           | `^19`   |
| `react-hook-form`     | `^7`    |
| `@hookform/resolvers` | `^5`    |
| `zod`                 | `^4`    |

## Mental model

1. **Fields are class instances.** `new TextField({...})`, `new SelectField({...})`, etc. Each class knows its base Zod
   schema, its renderer dispatch, and its config shape.
2. **Two form strategies.** `BasicForm` renders a flat list of fields — you own the submit button via a render prop.
   `StepperForm` adds step orchestration, navigation validation, and progress tracking, delegating the chrome to a
   `StepperWrapper` you provide.
3. **Rendering is slot-driven.** `FormFieldProvider` injects a `slots` map (one component per field type) into context.
   `BasicForm` needs only `slots`; `StepperForm` additionally requires `StepperWrapper`.

## Quick start — BasicForm

```tsx
import {
    BasicForm,
    FormFieldProvider,
    defineFields,
    TextField,
    SelectField,
    type FormFieldSlots,
} from '@zicenter/form-kit';

const slots: FormFieldSlots = {
    text: ({field, value, onChange, error, disabled}) => (
        <label>
            <span>{field.label}</span>
            <input
                value={(value as string) ?? ''}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
            />
            {error && <em>{error}</em>}
        </label>
    ),
    select: ({field, value, onChange, disabled}) => {
        // render your own <select> using field.options() / field.optionLabel / field.optionValue
        return null;
    },
    // textarea, number, currency, date, checkbox, multiselect,
    // autocomplete, 'multi-autocomplete', file, array — all required
};

const fields = defineFields([
    new TextField({key: 'email', label: 'Email', required: true, validation: (s) => s.email()}),
    new TextField({key: 'name', label: 'Name', required: true}),
]);

export function SignupForm() {
    return (
        <FormFieldProvider slots={slots}>
            <BasicForm
                fields={fields}
                defaultValues={{}}
                onSubmit={async (values) => await api.createUser(values)}
                renderForm={({fields, handleSubmit, isSubmitting}) => (
                    <div>
                        <div className="grid">{fields}</div>
                        <button onClick={handleSubmit} disabled={isSubmitting}>
                            Submit
                        </button>
                    </div>
                )}
            />
        </FormFieldProvider>
    );
}
```

## Quick start — StepperForm

```tsx
import {
    StepperForm,
    FormFieldProvider,
    defineFields,
    defineSteps,
    TextField,
    type FormFieldSlots,
    type StepperWrapper,
} from '@zicenter/form-kit';

const slots: FormFieldSlots = { /* same slot map as above */ };

// Stepper shell — receives navigation state and renders the step content as children.
const StepperShell: StepperWrapper = ({children, onSubmit, onCancel, isSubmitting}) => (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        {children}
        <button type="submit" disabled={isSubmitting}>Submit</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
);

const steps = defineSteps([
    {id: 'account', label: 'Account', fields: defineFields([
        new TextField({key: 'email', label: 'Email', required: true, validation: (s) => s.email()}),
    ])},
    {id: 'profile', label: 'Profile', fields: defineFields([
        new TextField({key: 'name', label: 'Name', required: true}),
    ])},
]);

export function OnboardingForm() {
    return (
        <FormFieldProvider slots={slots} StepperWrapper={StepperShell}>
            <StepperForm
                title="Onboarding"
                steps={steps}
                onSubmit={async (values) => await api.createUser(values)}
            />
        </FormFieldProvider>
    );
}
```

## Validation

Each field config takes a `validation: (schema) => schema` callback. The callback receives the field's narrow base Zod
schema (e.g. `z.ZodString` for `TextField`, `z.ZodNumber` for `NumberField`) and returns a refined schema:

```ts
new TextField({key: 'email', label: 'Email', required: true, validation: (s) => s.email()});

new NumberField({key: 'age', label: 'Age', required: true, validation: (s) => s.min(18).max(120)});
```

For cross-field rules, use `refine`:

```ts
new TextField({
    key: 'confirmPassword',
    label: 'Confirm password',
    required: true,
    refine: (value, formValues) =>
        value !== formValues.password ? 'Passwords must match' : undefined,
});
```

Optional fields are produced by leaving `required` falsy — schemas are wrapped in `.optional()` automatically.

## Visibility & disabled state

Both accept either a static value or a `(formValues) => boolean` predicate:

```ts
new TextField({
    key: 'companyName',
    label: 'Company',
    visibleWhen: (v) => v.accountType === 'business',
    disabled: (v) => v.locked === true,
});
```

`FieldRenderer` short-circuits to `null` when `isVisible` is false; otherwise it forwards `disabled` down to the slot
component.

## Multi-step forms

```tsx
const steps = defineSteps([
    {id: 'profile', label: 'Profile', fields: profileFields},
    {id: 'billing', label: 'Billing', fields: billingFields, icon: 'card'},
    {id: 'review', label: 'Review', component: ReviewStep},
]);
```

Each step is either field-based (`fields`) or component-based (`component`). The `StepperWrapper` you pass to
`FormFieldProvider` is the stepper UI shell — `StepperForm` feeds it `currentStep`, `steps` (with computed
`description` and completion percentage), `onStepChange`, `onSubmit`, etc. (see `StepperProps`).

A component step receives `{ form, getData? }` so it can read/write `react-hook-form` state directly.

## Field classes

| Class                             | Base schema       | Output type             |
|-----------------------------------|-------------------|-------------------------|
| `TextField`                       | `z.ZodString`     | `string`                |
| `TextareaField`                   | `z.ZodString`     | `string`                |
| `NumberField`                     | `z.ZodNumber`     | `number`                |
| `CurrencyField`                   | `z.ZodNumber`     | `number`                |
| `DateField`                       | `z.ZodString`     | `string` (ISO)          |
| `CheckboxField`                   | `z.ZodBoolean`    | `boolean`               |
| `SelectField<TOption>`            | enum-like         | `string \| number`      |
| `MultiselectField<TOption>`       | array             | `(string \| number)[]`  |
| `AutocompleteField<TOption>`      | enum-like         | `string \| number`      |
| `MultiAutocompleteField<TOption>` | array             | `(string \| number)[]`  |
| `FileField`                       | `z.ZodType<File>` | `File`                  |
| `ArrayField`                      | object array      | `Record<string, any>[]` |

Each class is constructed with a config object — the constructor signature is the contract. Option-based fields take an
async `options: () => Promise<TOption[]>` loader plus optional `optionLabel` / `optionValue` keys (defaults `'name'` /
`'id'`). `ArrayField` takes `itemFields: Field[]` to render per-row.

## Public API

### Components

- `BasicForm` — flat form; renders fields and exposes `{ fields, handleSubmit, isSubmitting, onCancel }` via a required
  `renderForm` render prop. Validates the full schema on submit.
- `StepperForm` — multi-step form; validates each step on navigation, tracks completion, delegates chrome to the
  `StepperWrapper` from context.
- `FieldRenderer` — single-field dispatcher (handles visibility + disabled, then delegates to the field's `Renderer`)

### Providers

- `FormFieldProvider` — supplies `slots` to both form components via context. `StepperWrapper` is an additional
  optional prop required only when using `StepperForm`.

### Hooks

- `useFormEngine` — headless alternative if you want to drive layout yourself (returns
  `{ form, handleSubmit, fields, getFieldState, reset }`)

### Field classes

`TextField`, `TextareaField`, `NumberField`, `CurrencyField`, `DateField`, `CheckboxField`, `SelectField`,
`MultiselectField`, `AutocompleteField`, `MultiAutocompleteField`, `FileField`, `ArrayField`.

### Types

- `Field` — alias for any field instance
- `FormFieldRenderProps<F>` — props passed to slot components
- `FormFieldSlots` — slot map type
- `FormStep`, `StepComponentProps`
- `StepperProps`, `StepperStep`, `StepperWrapper`

### Utilities

- `defineFields`, `defineSteps` — identity helpers that preserve const tuple inference
- `mapRawOptions(raw, config)` — normalize a raw option array into `{ label, value }` pairs using `optionLabel` /
  `optionValue`
- `coerceQueryParams(params, fields)` — coerce a `URLSearchParams` into a typed values object using each field's
  schema (skips `FileField` / `ArrayField`)

## Design principles

- **Headless.** No CSS, no layout opinions. You own every visual.
- **Classes as the source of truth.** A field instance carries its key, label, schema builder, coercion rule, and
  renderer — schema, defaults, query coercion, and rendering all derive from it.
- **Strategy pattern.** `BasicForm` and `StepperForm` are two orchestration strategies over the same field primitives.
  Choose the one that fits; swap without touching field definitions.
- **Slots for rendering.** `FormFieldProvider` is the only seam between the engine and your inputs.
- **Typed end-to-end.** `OutputOf<F>` flows the field's output type into `value`/`onChange` on each slot.

## Development

```sh
pnpm install
pnpm build       # tsup → dist/
pnpm typecheck
```

## License

UNLICENSED — internal ZiCenter package.
