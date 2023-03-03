import { it } from "vitest";
import { createMock } from "./createMock";
import { fromAny, fromPartial, fromExact } from "./utils";

type User = {
  id: string;
  name: string;
};

const func = (user: User) => {};

const baseUser = createMock<User>().set({
  id: "123123",
  name: "awdawd",
});

it("Should work", () => {
  func(baseUser.fromExact({}));
});

const getUserId = (user: User) => {};
