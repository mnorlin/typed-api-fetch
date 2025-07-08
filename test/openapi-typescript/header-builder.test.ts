import { buildHeaders } from "../../src/openapi-typescript/header-builder";

describe("Headers resolves to Record<string, string>", () => {
  describe("when default headers", () => {
    it("is HeadersInit", () => {
      const headers = buildHeaders(
        "",
        new Headers({ accept: "application/json" }),
      );

      expect(headers).toStrictEqual({ accept: "application/json" });
    });

    it("is [string, string][]", () => {
      const headers = buildHeaders("", [["accept", "application/json"]]);

      expect(headers).toStrictEqual({ accept: "application/json" });
    });

    it("is Record<string, string>", () => {
      const headers = buildHeaders("", { accept: "application/json" });

      expect(headers).toStrictEqual({ accept: "application/json" });
    });

    it("is function", () => {
      const headers = buildHeaders("http://example.org", (pathInfo) => ({
        referrer: pathInfo.resolvedPath,
      }));

      expect(headers).toStrictEqual({ referrer: "http://example.org" });
    });
  });

  describe("when option headers", () => {
    it("is HeadersInit", () => {
      const headers = buildHeaders(
        "",
        undefined,
        new Headers({ accept: "application/json" }),
      );

      expect(headers).toStrictEqual({ accept: "application/json" });
    });

    it("is [string, string][]", () => {
      const headers = buildHeaders("", undefined, [
        ["accept", "application/json"],
      ]);

      expect(headers).toStrictEqual({ accept: "application/json" });
    });

    it("is Record<string, string>", () => {
      const headers = buildHeaders("", undefined, {
        accept: "application/json",
      });

      expect(headers).toStrictEqual({ accept: "application/json" });
    });
  });

  describe("when merging default headers and option headers", () => {
    const headers = buildHeaders(
      "",
      new Headers({ accept: "application/json" }),
      { connection: "keep-alive" },
    );

    expect(headers).toStrictEqual({
      accept: "application/json",
      connection: "keep-alive",
    });
  });
});
