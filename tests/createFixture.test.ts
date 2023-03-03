import { describe, expect, it } from "vitest";
import { createFixture } from "../src";
import { Equal, Expect } from "./test-utils";

describe("createFixture", () => {
  type User = {
    id: number;
    name: string;
    reports: {
      id: number;
    }[];
  };

  const user = createFixture<User>();

  it("Should start off with an empty object base, but should be assignable to the correct type", () => {
    const fixture = user.get();

    expect(fixture).toEqual({});

    type test = Expect<Equal<typeof fixture, User>>;
  });

  it(".set should create an object with a new base", () => {
    const fixture = user.set({ id: 1 }).get();

    expect(fixture).toEqual({
      id: 1,
    });

    type test = Expect<Equal<typeof fixture, User>>;
  });

  it(".set should override previous sets sets", () => {
    const fixture = user.set({ id: 1 }).set({ name: "Bob" }).get();

    // The id disappears!
    expect(fixture).toEqual({
      name: "Bob",
    });
  });

  it(".fromExact should require all properties if none have been specified with .set", () => {
    user.fromExact(
      // @ts-expect-error
      {
        id: 1,
        name: "Bob",
      }
    );
  });

  it(".fromExact should require only missing properties if some have been specified with .set", () => {
    const fixture = user.set({ id: 1 }).fromExact({
      name: "Bob",
      reports: [],
    });

    expect(fixture).toEqual({
      id: 1,
      name: "Bob",
      reports: [],
    });

    user
      .set({
        id: 1,
        reports: [],
      })
      .fromExact(
        // @ts-expect-error
        {}
      );
  });

  it(".fromPartial should allow you to pass a partial of the type", () => {
    const fixture = user.fromPartial({
      name: "Bob",
    });

    type test = Expect<Equal<typeof fixture, User>>;

    expect(fixture).toEqual({
      name: "Bob",
    });
  });

  it(".fromPartial should give you excess property warnings", () => {
    user.fromPartial({
      // @ts-expect-error
      whatever: "whatever",
    });
  });

  it(".fromAny should override the base", () => {
    const fixture = user
      .set({
        id: 1,
      })
      .fromAny("wow");

    type test = Expect<Equal<typeof fixture, User>>;

    expect(fixture).toEqual("wow");
  });
});
