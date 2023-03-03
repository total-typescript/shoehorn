import { it } from "vitest";
import { createFixture } from "./createFixture";
import { fromAny, fromPartial, fromExact } from "./utils";

type User = {
  id: string;
  name: string;
};

const func = (user: User) => {};

const baseUser = createFixture<User>().set({
  id: "123123",
  name: "awdawd",
});

it("Should work", () => {
  func(baseUser.fromExact({}));
});

const getUserId = (user: User) => {};
