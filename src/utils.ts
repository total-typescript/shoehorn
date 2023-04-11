import { NoInfer, PartialDeep } from "./types";

/**
 * Lets you pass a deep partial to a slot expecting a type.
 *
 * @returns whatever you pass in
 */
export const fromPartial = <T>(mock: PartialDeep<NoInfer<T>>): T => {
  return mock as T;
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
 * Forces you to pass the exact type of the thing the slot requires
 *
 * @returns whatever you pass in
 */
export const fromExact = <T>(mock: T): T => {
  return mock;
};
