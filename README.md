# @zicenter/form-kit

Form primitives for `@zicenter/resource-kit`. Provides a `FieldDef`-driven form API that auto-builds a Zod schema and wires it to `react-hook-form`.

## Install

This package is consumed as a git-based npm dependency:

```json
{
  "dependencies": {
    "@zicenter/form-kit": "github:ZiCenter/form-kit#main"
  }
}
```

`pnpm install` clones the repo and runs `prepare` (which runs `tsup`), so consumers always resolve against built output in `dist/`.

## Peer dependencies

- `react` ^19
- `react-dom` ^19
- `react-hook-form` ^7
- `@hookform/resolvers` ^5
- `zod` ^4

## License

UNLICENSED (internal ZiCenter package).
