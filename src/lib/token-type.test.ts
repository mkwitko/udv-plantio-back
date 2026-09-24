import { describe, expect, it } from "vitest";
import { isTokenType } from "./token-type";

describe("isTokenType", () => {
  it("rejects a refresh token used as access and vice versa", () => {
    expect(isTokenType({ typ: "refresh" }, "access")).toBe(false);
    expect(isTokenType({ typ: "access" }, "refresh")).toBe(false);
  });

  it("accepts the matching type and legacy tokens without typ", () => {
    expect(isTokenType({ typ: "access" }, "access")).toBe(true);
    expect(isTokenType({}, "refresh")).toBe(true);
  });
});
