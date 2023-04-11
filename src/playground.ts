import { it } from "vitest";
import { fromAny, fromPartial } from "./utils";

type Request = {
  body: {
    id: string;
  };
  // Imagine oodles of other properties...
};

// The function we're testing
const requiresRequest = (request: Request) => {};

requiresRequest(fromAny("1234123"));
