# `mock-utils`

`mock-utils` solves the 'as' problem in TypeScript tests.

```ts
type User = {
  id: string;
  name: string;
  // Imagine oodles of other properties...
};

it("Should return an id", () => {
  // Even though we only care about User.id for
  // this test, we need to pass in the whole User
  // object
  getUserId({
    id: "123",
  } as User);
});
```

'as' in tests feels bad.

- You're trained not to use it
- You need to _manually_ specify the type you want to assert to
- For testing with incorrect data, you need to 'double-as' (`as unknown as User`)

`mock-utils` gives you some first-class primitives for _safely_ providing incomplete data to tests.

```ts
import { fromPartial } from "@total-typescript/mock-utils";

it("Should return an id", () => {
  getUserId(
    fromPartial({
      id: "123",
    })
  );
});
```

## Pass types to

### `fromExact`

### `fromAny`

### `fromPartial`

`fromPartial` lets you pass a deep partial of an object to a slot expecting that
object. This is

## `createMock`
