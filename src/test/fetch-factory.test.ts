import { FetchFactory } from "../openapi-typescript/fetch-factory";
import { components, paths } from "./example/petstore-openapi3";
import { IsEqual } from "./tools";

const mockedJson = jest.fn(() => ({} as any));

const mockedFetch = jest.fn(() => ({ ok: true, json: mockedJson } as any));

const fetch = FetchFactory.build<paths>({
  baseUrl: "https://petstore3.swagger.io",
  defaultInit: {
    headers: {
      Accept: "application/json",
    },
    integrity: "hashy",
  },
  fetchMethod: mockedFetch,
});

describe("fetch", () => {
  it("calls supplied fetch function", () => {
    fetch("/store/inventory", { method: "get" });

    expect(mockedFetch.mock.calls).toHaveLength(1);
  });

  it("calls API path", () => {
    fetch("/store/inventory", { method: "get" });

    expect((mockedFetch.mock.calls[0] as any)[0]).toBe(
      "https://petstore3.swagger.io/store/inventory"
    );
  });

  it("uses defaultInit headers", () => {
    fetch("/store/inventory", { method: "get" });

    const headers = Object.entries(
      (mockedFetch.mock.calls[0] as any)[1].headers
    );
    expect(headers).toHaveLength(1);
    expect(headers[0][0]).toBe("Accept");
    expect(headers[0][1]).toBe("application/json");
  });

  it("resolves path parameter", () => {
    fetch("/pet/{petId}", {
      method: "get",
      parameters: { path: { petId: 42 } },
    });

    expect((mockedFetch.mock.calls[0] as any)[0]).toBe(
      "https://petstore3.swagger.io/pet/42"
    );
  });

  it("resolves query parameter", () => {
    fetch("/pet/findByStatus", {
      method: "get",
      parameters: { query: { status: "available" } },
    });

    expect((mockedFetch.mock.calls[0] as any)[0]).toBe(
      "https://petstore3.swagger.io/pet/findByStatus?status=available"
    );
  });

  it("merges headers with default headers", () => {
    fetch("/store/inventory", {
      method: "get",
      headers: { "If-Match": "abc" },
    });

    const headers = Object.entries(
      (mockedFetch.mock.calls[0] as any)[1].headers
    );
    expect(headers).toHaveLength(2);

    expect(headers[0][0]).toBe("Accept");
    expect(headers[0][1]).toBe("application/json");

    expect(headers[1][0]).toBe("If-Match");
    expect(headers[1][1]).toBe("abc");
  });

  it("overwrites defaultInit headers", () => {
    fetch("/store/inventory", {
      method: "get",
      headers: { Accept: "nothing" },
    });

    const headers = Object.entries(
      (mockedFetch.mock.calls[0] as any)[1].headers
    );
    expect(headers).toHaveLength(1);

    expect(headers[0][0]).toBe("Accept");
    expect(headers[0][1]).toBe("nothing");
  });

  it("uses defaultInit integrity", () => {
    fetch("/store/inventory", {
      method: "get",
      headers: { Accept: "nothing" },
    });

    expect((mockedFetch.mock.calls[0] as any)[1].integrity).toBe("hashy");
  });

  it("overwrites defaultInit integrity", () => {
    fetch("/store/inventory", {
      method: "get",
      headers: { Accept: "nothing" },
      integrity: "dummy",
    });

    expect((mockedFetch.mock.calls[0] as any)[1].integrity).toBe("dummy");
  });
});

describe("response", () => {
  it("calls json() of response", async () => {
    const response = await fetch("/store/inventory", { method: "get" });
    response.json();

    expect(mockedJson.mock.calls).toHaveLength(1);
  });

  it("can be discriminated based on ok property", async () => {
    const response = await fetch("/pet/{petId}", {
      method: "get",
      parameters: { path: { petId: 42 } },
    });

    if (response.ok) {
      const payload = await response.json();
      const equals: IsEqual<typeof payload, PetType> = true;
      expect(equals).toBe(true);
    } else {
      const payload = await response.json();
      const equal: IsEqual<typeof payload, PetType> = false;
      expect(equal).toBe(false);
    }
  });

  it("can be discriminated based on status property", async () => {
    const response = await fetch("/pet/{petId}", {
      method: "get",
      parameters: { path: { petId: 42 } },
    });

    if (response.status === 200) {
      const payload = await response.json();
      const equals: IsEqual<typeof payload, PetType> = true;
      expect(equals).toBe(true);
    }

    if (response.status === 400) {
      const payload = await response.json();
      const never: IsEqual<typeof payload, unknown> = true;
      expect(never).toBe(true);
    }
  });
});

type PetType = components["schemas"]["Pet"];
