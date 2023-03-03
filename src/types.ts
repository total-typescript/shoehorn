export type NoInfer<T> = [T][T extends any ? 0 : never];

/**
 * Adapted from type-fest's PartialDeep
 */
export type PartialDeep<T> = T extends (...args: any[]) => unknown
  ? T | undefined
  : T extends object
  ? T extends ReadonlyArray<infer ItemType> // Test for arrays/tuples, per https://github.com/microsoft/TypeScript/issues/35156
    ? ItemType[] extends T // Test for arrays (non-tuples) specifically
      ? readonly ItemType[] extends T // Differentiate readonly and mutable arrays
        ? ReadonlyArray<PartialDeep<ItemType | undefined>>
        : Array<PartialDeep<ItemType | undefined>>
      : PartialObjectDeep<T> // Tuples behave properly
    : PartialObjectDeep<T>
  : T;

export type PartialObjectDeep<ObjectType extends object> = {
  [KeyType in keyof ObjectType]?: PartialDeep<ObjectType[KeyType]>;
};

export interface Base<T, Default = {}> {
  _base: Default;
  get: () => T;
  set: <NewDefault extends Partial<T>>(base: NewDefault) => Base<T, NewDefault>;
  fromExact: (mock: Omit<T, keyof Default> & Partial<Default>) => T;
  fromPartial: (mock: PartialDeep<T>) => T;
  fromAny: <U>(mock: U | NoInfer<T>) => T;
}
