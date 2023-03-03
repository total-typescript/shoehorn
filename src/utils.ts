import { Base, NoInfer, PartialDeep } from "./types";

const undefinedProperties = new Set<string | symbol>([
  "nodeType",
  "nodeName",
  "isEqualNode",
  "asymmetricMatch",
]);

/**
 * Lets you pass a deep partial of a type to a function
 *
 * @returns whatever you pass in
 */
export const fromPartial = <T>(mock: object & PartialDeep<NoInfer<T>>): T => {
  const proxy = new Proxy(mock, {
    get(target, p, receiver) {
      if (undefinedProperties.has(p)) return undefined;

      if (typeof p !== "symbol" && !(p in target)) {
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
