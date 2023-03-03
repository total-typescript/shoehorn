import { describe, expect, it } from "vitest";
import { fromAny, fromExact, fromPartial } from "../src";
import { Equal, Expect } from "./test-utils";

const accept = <T>(_t: T) => {};

describe("fromPartial", () => {
  it("Should return whatever you pass in", () => {
    const result = fromPartial({ foo: "bar" });

    expect(result).toEqual({ foo: "bar" });
  });

  it("Should recursively return whatever you pass in", () => {
    const result = fromPartial({ foo: {bar: "bazz"} });

    expect(result).toEqual({ foo: { bar: "bazz" } });
  });

  it("Should return whatever you pass in with arrays", () => {
    const result = fromPartial({ foo: ["bar", "bazz"] });

    expect(result).toEqual({ foo: ["bar", "bazz"] });
  });

  it("Should throw an error when the test itself accesses a property not defined on the input", () => {
    const func = (input: { id: string }) => {
      return input.id;
    };

    expect(() => func(fromPartial({}))).toThrow();
  });

  it("Should recursively throw an error when the test itself accesses a property not defined on the input", () => {
    const func = (input: { id: {value: string} }) => {
      return input.id.value;
    };

    expect(() => func(fromPartial({ id: {} }))).toThrow();
  });

  it("When not passed into a function, it should return unknown", () => {
    const result = fromPartial({ foo: "bar" });

    type test = Expect<Equal<typeof result, unknown>>;
  });

  it("When passed a type argument, it should let you pass a partial of the type", () => {
    const result = fromPartial<{ foo: string; bar: string }>({
      foo: "str",
    });

    type test = Expect<Equal<typeof result, { foo: string; bar: string }>>;
  });

  describe("Recursive", () => {
    function newA() {
      const partialGivenA: Partial<A> = {}

      const givenB: B = {
        aprop: partialGivenA as A
      }

      partialGivenA.bprop = givenB;
      return partialGivenA as A;
    }
    type A = {
      bprop: B
    }

    type B = {
      aprop: A
    }

    it("When passing a recursive object, it should not throw", () => {
      const givenA = newA();

      expect(() => fromPartial(givenA)).not.toThrow();
    });

    it("When passing a recursive object, it should throw on incorrect nested access", () => {
      const givenA = newA();

      const result: A = fromPartial(givenA);

      const func = (input: A) => {
        return (input.bprop.aprop.bprop.aprop as any).value;
      };

      expect(() => func(result)).toThrow();
    });
  });

  it("When passed into a function, it should let you pass a partial", () => {
    accept<{
      foo: string;
      bar: number;
    }>(
      fromPartial({
        foo: "bar",
      })
    );
  });

  it("When passed into a function, it should let you pass a deep partial", () => {
    accept<{
      foo: string;
      bar: {
        baz: number;
      };
      arr: {
        id: number;
        name: string;
      }[];
    }>(
      fromPartial({
        foo: "bar",
        bar: {},
        arr: [{ id: 1 }],
      })
    );
  });

  it("When passed into a function, it should give excess property warnings", () => {
    accept<{
      foo: string;
      bar: number;
    }>(
      fromPartial({
        foo: "bar",
        // @ts-expect-error
        baz: 1,
      })
    );
  });
});

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
      })
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
      })
    );
  });
});

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
      })
    );
  });
});
