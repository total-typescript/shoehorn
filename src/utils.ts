import { Base, NoInfer, PartialDeep } from "./types";

const undefinedProperties = new Set<string | symbol>([
  "nodeType",
  "nodeName",
  "isEqualNode",
  "asymmetricMatch",
]);

const isFromPartialSymbol = Symbol("isFromPartial");

/**
 * Lets you pass a deep partial of a type to a function
 *
 * @returns whatever you pass in
 */
export const fromPartial = <T>(mock: PartialDeep<NoInfer<T>>): T => {
  const proxy = new Proxy(mock as {}, {
    get(target, p, receiver) {
      if (p == isFromPartialSymbol) return true;

      if (!undefinedProperties.has(p) && typeof p !== "symbol" && !(p in target)) {
        throw new Error(`${String(p)} not found in mocked object`);
      }

      var actual = Reflect.get(target, p, receiver);
      // Check if we are something we can recursively make proxies for.
      // We also want to make sure that we are not making a proxy for 
      // something that is already a fromPartial proxy.
      // We might end up in an infinite loop if we don't do this.
      if (typeof actual === "object"
        && actual !== null
        && !isFromPartialInstance(actual)) { 
        return fromPartial(actual);
      }

      return actual;
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


function isFromPartialInstance(obj: any) { 
  return obj[isFromPartialSymbol] === true;
}