import { FetchFactory } from "../../src/openapi-typescript/fetch-factory";
import { paths, components } from "./test-data/petstore-openapi3";
import { IsEqual } from "../test-tools";

const mockedJson = jest.fn(() => ({} as any));
const mockedFetch = jest.fn(() => ({ ok: true, json: mockedJson } as any));
global.fetch = jest.fn(() => ({ ok: true, json: mockedJson } as any));

const defaultFetch = FetchFactory.build<paths>();

const customFetch = FetchFactory.build<paths>({
  baseUrl: "https://petstore3.swagger.io",
  defaultInit: {
    headers: {
      Accept: "application/json",
    },
    integrity: "hashy",
  },
  fetchMethod: mockedFetch,
});

describe("generated fetch from FetchFactory with no options", () => {
  it("calls global.fetch function", () => {
    defaultFetch("/store/inventory", { method: "get" });

    expect((global.fetch as jest.Mock).mock.calls).toHaveLength(1);
  });

  it("calls fetch path", () => {
    defaultFetch("/store/inventory", { method: "get" });

    expect(((global.fetch as jest.Mock).mock.calls[0] as any)[0]).toBe(
      "/store/inventory"
    );
  });

  it("calls with no headers as default", () => {
    defaultFetch("/store/inventory", { method: "get" });

    const headers = Object.entries(
      ((global.fetch as jest.Mock).mock.calls[0] as any)[1].headers
    );
    expect(headers).toHaveLength(0);
  });

  it("calls with fetch headers", () => {
    defaultFetch("/store/inventory", {
      method: "get",
      headers: { Accept: "application/json" },
    });

    const headers = Object.entries(
      ((global.fetch as jest.Mock).mock.calls[0] as any)[1].headers
    );
    expect(headers).toHaveLength(1);

    expect(headers[0][0]).toBe("Accept");
    expect(headers[0][1]).toBe("application/json");
  });
});

describe("generated fetch from FetchFactory with custom options", () => {
  it("calls supplied fetch function", () => {
    customFetch("/store/inventory", { method: "get" });

    expect(mockedFetch.mock.calls).toHaveLength(1);
  });

  it("prefixes baseUrl to fetch path", () => {
    customFetch("/store/inventory", { method: "get" });

    expect((mockedFetch.mock.calls[0] as any)[0]).toBe(
      "https://petstore3.swagger.io/store/inventory"
    );
  });

  it("uses defaultInit headers", () => {
    customFetch("/store/inventory", { method: "get" });

    const headers = Object.entries(
      (mockedFetch.mock.calls[0] as any)[1].headers
    );
    expect(headers).toHaveLength(1);
    expect(headers[0][0]).toBe("Accept");
    expect(headers[0][1]).toBe("application/json");
  });
});

describe("Generated fetch function argument typing", () => {
  it("accepts existing path", () => {
    customFetch("/store/inventory", { method: "get" });

    expect(true).toBe(true);
  });

  it("rejects missing path", () => {
    // @ts-expect-error: non-existing path argument
    customFetch("/hello", { method: "get" });

    expect(true).toBe(true);
  });

  it("accepts correct request method", () => {
    customFetch("/store/inventory", { method: "get" });

    expect(true).toBe(true);
  });

  it("rejects wrong request method", () => {
    // @ts-expect-error: wrong type on method
    customFetch("/store/inventory", { method: "post" });

    expect(true).toBe(true);
  });

  it("accepts correct path parameter", () => {
    customFetch("/pet/{petId}", {
      method: "get",
      parameters: { path: { petId: 3 } },
    });

    expect(true).toBe(true);
  });

  it("rejects missing path parameter", () => {
    // @ts-expect-error: missing required path parameter
    customFetch("/pet/{petId}", { method: "get" });

    expect(true).toBe(true);
  });

  it("rejects wrongly typed path parameter", () => {
    customFetch("/pet/{petId}", {
      method: "get",
      // @ts-expect-error: wrongly typed path parameter
      parameters: { path: { petId: "hello" } },
    });

    expect(true).toBe(true);
  });

  it("accepts correct query parameter", () => {
    customFetch("/pet/findByStatus", {
      method: "get",
      parameters: { query: { status: "available" } },
    });

    expect(true).toBe(true);
  });

  it("rejects missing path parameter", () => {
    // @ts-expect-error: missing required query parameter
    customFetch("/pet/findByStatus", { method: "get" });

    expect(true).toBe(true);
  });

  it("rejects wrongly typed path parameter", () => {
    customFetch("/pet/findByStatus", {
      method: "get",
      // @ts-expect-error: wrongly typed query parameter
      parameters: { query: { status: "hello" } },
    });

    expect(true).toBe(true);
  });
});

describe("Generated fetch request", () => {
  it("resolves path parameter", () => {
    customFetch("/pet/{petId}", {
      method: "get",
      parameters: { path: { petId: 42 } },
    });

    expect((mockedFetch.mock.calls[0] as any)[0]).toBe(
      "https://petstore3.swagger.io/pet/42"
    );
  });

  it("resolves query parameter", () => {
    customFetch("/pet/findByStatus", {
      method: "get",
      parameters: { query: { status: "available" } },
    });

    expect((mockedFetch.mock.calls[0] as any)[0]).toBe(
      "https://petstore3.swagger.io/pet/findByStatus?status=available"
    );
  });

  it("merges headers with default headers", () => {
    customFetch("/store/inventory", {
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
    customFetch("/store/inventory", {
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
    customFetch("/store/inventory", {
      method: "get",
      headers: { Accept: "nothing" },
    });

    expect((mockedFetch.mock.calls[0] as any)[1].integrity).toBe("hashy");
  });

  it("overwrites defaultInit integrity", () => {
    customFetch("/store/inventory", {
      method: "get",
      headers: { Accept: "nothing" },
      integrity: "dummy",
    });

    expect((mockedFetch.mock.calls[0] as any)[1].integrity).toBe("dummy");
  });

  it("stringifies request body", () => {
    const body = {
      id: 1,
      petId: 2,
      quantity: 3,
      shipDate: "2023-03-14",
      status: "approved" as const,
      complete: true,
    };

    customFetch("/store/order", {
      method: "post",
      headers: { Accept: "nothing" },
      integrity: "dummy",
      body: body,
    });

    expect((mockedFetch.mock.calls[0] as any)[1].body).toBe(
      JSON.stringify(body)
    );
  });
});

describe("Generated fetch response", () => {
  it("calls json() of response", async () => {
    const response = await customFetch("/store/inventory", { method: "get" });
    response.json();

    expect(mockedJson.mock.calls).toHaveLength(1);
  });

  it("can be discriminated based on ok property", async () => {
    const response = await customFetch("/pet/{petId}", {
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
    const response = await customFetch("/pet/{petId}", {
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
