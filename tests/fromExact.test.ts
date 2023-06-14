import { describe, expect, it } from "vitest";
import { fromAny, fromExact, fromPartial } from "../src";
import { Equal, Expect, accept } from "./test-utils";

describe("fromExact", () => {
  it("Should return whatever you pass in", () => {
    const result = fromExact({ foo: "bar" });

    expect(result).toEqual({ foo: "bar" });
  });

  it("Should return the type you pass in", () => {
    const result = fromExact({ foo: "bar" });

    type test = Expect<Equal<typeof result, { foo: string }>>;
  });

  it("When passed to a function, it should expect the exact type", () => {
    accept<{ foo: string; bar: number }>(
      // @ts-expect-error
      fromExact({
        foo: "bar",
      }),
    );
  });
});
