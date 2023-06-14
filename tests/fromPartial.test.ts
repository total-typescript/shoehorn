import { describe, expect, it } from "vitest";
import { fromPartial } from "../src";
import { Equal, Expect, accept } from "./test-utils";

describe("fromPartial", () => {
  it("Should return whatever you pass in", () => {
    const result = fromPartial({ foo: "bar" });

    expect(result).toEqual({ foo: "bar" });
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

  it("When passed into a function, it should let you pass a partial", () => {
    accept<{
      foo: string;
      bar: number;
    }>(
      fromPartial({
        foo: "bar",
      }),
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
      }),
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
      }),
    );
  });

  it("Should accept functions", () => {
    accept<() => void>(fromPartial({}));
  });

  it("Should accept interfaces which combine object properties and a call signature", () => {
    accept<{
      (): void;
      foo: string;
    }>(fromPartial({}));
  });

  it("Should make interfaces which combined object properties and call signatures deeply partial", () => {
    accept<{
      (): void;
      foo: {
        deepProperty: string;
      };
    }>(
      fromPartial({
        foo: {},
      }),
    );
  });
});
