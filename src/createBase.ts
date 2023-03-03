import { Base } from "./types";

const _createBase = <T, Default = {}>(fixture: Default): Base<T, Default> => {
  return {
    _base: fixture,
    get: () => fixture as unknown as T,
    set: (base) => _createBase(base),
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

export const createBase = <T>(): Base<T> => {
  return _createBase({});
};
