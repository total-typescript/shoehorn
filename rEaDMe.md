# `shoehorn`

`shoehorn` lets you pass partial data in tests, while keeping TypeScript happy.

```ts
type Request = {
  body: {
    id: string;
  };
  // Imagine oodles of other properties...
};

it("Should get the user", () => {
  // Even though we only care about body.id for
  // this test, we need to pass in the whole Request
  // object
  getUser({
    body: {
      id: "123",
    },
  } as Request);
});
```

'as' in tests feels bad.

- You're trained not to use it
- You need to _manually_ specify the type you want to assert to
- For testing with incorrect data, you need to 'double-as' (`as unknown as User`)

`shoehorn` gives you some first-class primitives for _safely_ providing incomplete data to tests.

```ts
import { fromPartial } from "@total-typescript/shoehorn";

it("Should get the user", () => {
  getUser(
    fromPartial({
      body: {
        id: "123",
      },
    }),
  );
});
```

### But isn't passing partial data to tests bad?

Yes, in general. Having to pass huge objects to tests is a sign that your types are too loose. Ideally, every function should only specify the data it needs.

Unfortunately, we live in the real world. There are many cases where `shoehorn` is the best choice:

- **Legacy codebases**: If you're working on a large codebase, you might not have the time to refactor everything to be perfect.
- **Third-party libraries**: If you're using a third-party library, you might not be able to alter the types without needless wrapper functions.

## API

For each example below, imagine that the following types are defined:

```ts
type Request = {
  body: {
    id: string;
  };
  // Imagine oodles of other properties...
};

// The function we're testing
const requiresRequest = (request: Request) => {};
```

### `fromPartial`

Lets you pass a deep partial to a slot expecting a type.

```ts
import { fromPartial } from "@total-typescript/shoehorn";

requiresRequest(
  fromPartial({
    body: {
      id: "123",
    },
  }),
);
```

It'll fail if you pass a type that doesn't match the one expected:

```ts
// Type "1234123" has no properties in common
// with type 'PartialObjectDeep<Request>'
requiresRequest(fromPartial("1234123"));
```

### `fromAny`

Lets you pass anything to a slot, while still giving you autocomplete on the original type:

```ts
import { fromAny } from "@total-typescript/shoehorn";

requiresRequest(
  fromAny({
    body: {
      id: 124123,
    },
  }),
);
```

It WILL NOT FAIL if you pass something that doesn't match.

```ts
// All good!
requiresRequest(fromAny("1234123"));
```

### `fromExact`

A convenience method for forcing you to pass all the properties of a type. Useful for when you want to swap in and out of `fromPartial`/`fromAny`:

```ts
import { fromExact } from "@total-typescript/shoehorn";

requiresRequest(
  // Will fail! We're not passing all the oodles of
  // properties of Request
  fromExact({
    body: {
      id: 124123,
    },
  }),
);
```
