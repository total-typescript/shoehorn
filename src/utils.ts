import { NoInfer, PartialDeep } from "./types";

/**
 * Lets you pass a deep partial of a type to a function
 *
 * @returns whatever you pass in
 */

const PROTECTED_KEYS = [
  "nodeType",
  "nodeName",
  "isEqualNode",
  "asymmetricMatch",
];
export const fromPartial = <T>(mock: PartialDeep<NoInfer<T>>): T => {
  const proxy = new Proxy(mock as {}, {
    get(target, p, receiver) {
      if (
        typeof p !== "symbol" &&
        !PROTECTED_KEYS.includes(p) &&
        !(p in target)
      ) {
        throw new Error(`${String(p)} not found in mocked object`);
      }
      return Reflect.get(target, p, receiver);
    },
  });
  return proxy as T;
};

/**
 * Lets you pass anything to a mock function, while also retaining
 * autocomplete for when you _do_ want to pass the exact thing.
 *
 * @returns whatever you pass in
 */
export const fromAny = <T, U>(mock: U | NoInfer<T>): T => {
  return mock as T;
};

/**
 * Forces you to pass the entire object
 *
 * @returns whatever you pass in
 */
export const fromExact = <T>(mock: T): T => {
  return mock;
};
