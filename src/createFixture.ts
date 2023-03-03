import { Base } from "./types";

const _createFixture = <T, Default = {}>(
  fixture: Default
): Base<T, Default> => {
  return {
    get: () => fixture as unknown as T,
    set: (base) => _createFixture(base),
    fromExact: (mock) => {
      return {
        ...fixture,
        ...mock,
      } as T;
    },
    fromPartial: (mock) => {
      return {
        ...fixture,
        ...mock,
      } as T;
    },
    fromAny: (mock) => mock as T,
  };
};

/**
 *
 *
 * @returns
 */
export const createFixture = <T>(): Base<T> => {
  return _createFixture({});
};
