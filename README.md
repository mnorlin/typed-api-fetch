# typed-api-fetch

`typed-api-fetch` creates a `fetch` method that mimics the browser native `fetch`, but with added type inference.

It is primarily focused on using the TypeScript definitions generated by [openapi-typescript](https://github.com/drwpow/openapi-typescript), a tool that generates TypeScript definitions from an OpenAPI specification.

## Install

```bash
npm install typed-api-fetch
```

## Usage

### Generate a TypeScript definition (optional)

To generate a TypeScript definition, you can use [openapi-typescript](https://github.com/drwpow/openapi-typescript) to parse an OpenAPI specification.

```bash
npx openapi-typescript https://petstore3.swagger.io/api/v3/openapi.json --output petstore.ts

# https://petstore3.swagger.io/api/v3/openapi.json → petstore.ts [818ms]
```

### Create a `fetch` function

With a type definition stored in `./petstore.ts`, it is now possible to build a typed `fetch` client.

```ts
import { paths } from "./petstore";
import { FetchFactory } from "typed-api-fetch";

const fetch = FetchFactory.build<paths>({
  baseUrl: "https://petstore3.swagger.io",
  defaultInit: {
    headers: {
      Accept: "application/json",
    },
  },
});
```

The builder accepts the following options

| Name          | Type       | Default | Description                                                                            |
| :------------ | :--------- | :------ | :------------------------------------------------------------------------------------- |
| `baseUrl`     | `string`   |         | Prefixed to the `path` of the fetch method (eg. `https://petstore3.swagger.io`)        |
| `defaultInit` | `object`   |         | Default options in the generated fetch method                                          |
| `fetchMethod` | `Function` | `fetch` | A fetch method used to call the API, must comply to the global Fetch method definition |

### Call the generated `fetch` function

```ts
const fetch = FetchFactory.build<paths>();
const response = await fetch(
  "/pet/{petId}", // path autocomplete
  {
    method: "get", // available methods depending on given path
    parameters: {
      path: { petId: 42 }, // typed path parameter
    },
  }
);
```

The `fetch` function takes two arguments, `path` and `options`. `options` has the same properties as the [global `fetch` function](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options), but with a few differences.

| Name         | Type     | Default | Description                                                                                    |
| :----------- | :------- | :------ | :--------------------------------------------------------------------------------------------- |
| `body`       | `object` |         | A JSON object that satisfies the API definition                                                |
| `parameters` | `object` |         | A record with a `path` and `query` property. See the example below this table of how to use it |

Given the path `/pet/{petId}`, and the parameter object

```ts
{
  path: { petId: 42 },
  query: { page: 3 },
}
```

the resolved path would be `/pet/42?page=3`.

### Infer the response body

An API can declare different response types for each status code.
These can be accessed via a `discriminated union` on either the `status` or `ok` property of the `response` object.

```ts
const response = await fetch("/users", { method: "get" });

if (response.ok) {
  const dataOk = await response.json(); // Infered type of HTTP 2XX status codes
}

if (response.status === 404) {
  const data404 = await response.json(); // Infered type on HTTP 404 status responses
}
```

## Acknowledgment

Inspired by [openapi-typescript-fetch](https://github.com/ajaishankar/openapi-typescript)
