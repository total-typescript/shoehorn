import { describe, expect, it } from "vitest";
import { Equal, Expect, accept } from "./test-utils";
import { fromAny } from "../src";

describe("fromAny", () => {
  it("Should return whatever you pass in", () => {
    const result = fromAny({ foo: "bar" });

    expect(result).toEqual({ foo: "bar" });
  });

  it("Should return unknown if not called in a function's args", () => {
    const result = fromAny({ foo: "bar" });

    type test = Expect<Equal<typeof result, unknown>>;
  });

  it("Should let you pass anything to a function", () => {
    accept<{ foo: string; bar: number }>(fromAny("str"));

    accept<{ foo: string; bar: number }>(fromAny(124123));

    accept<{ foo: string; bar: number }>(
      fromAny({
        foo: "awdaw",
      }),
    );
  });

  it("When passed into a function, it should NOT give excess property warnings", () => {
    accept<{
      foo: string;
      bar: number;
    }>(
      fromAny({
        foo: "bar",
        baz: 1,
      }),
    );
  });
});
