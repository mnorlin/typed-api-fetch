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

## Utility types

The `Operation` and `Paths` are the generated types from `openapi-typescript`.

| Name                                  | Description                                                                             |
| :------------------------------------ | :-------------------------------------------------------------------------------------- |
| `FetchOptions<Operation>`             | The `options` argument for the `fetch` function from a given `Operation`                |
| `FetchParameters<Operation>`          | The `parameters` property withing `options`, containing the `path` and `query` property |
| `ResponseBody<Operation, StatusCode>` | The response body given a specific HTTP `StatusCode`                                    |
| `ResponseBodyError<Operation>`        | The response body for error responses (HTTP status code 300-599)                        |
| `ResponseBodySucess<Operation>`       | The response body for error responses (HTTP status code 200-299)                        |
| `SubPaths<Paths, Method>`             | The paths given a specified HTTP `Method`.                                              |

### Example implmentations

Using the utility types, you can write a custom implementation using the generated `fetch` function. Below is an example of a React hook, that takes takes two arguments, `paths` and `parameters`, and returns the response of a successfull request. The available `paths` are only valid HTTP `GET` requests to the API.

```tsx
import { useEffect, useState } from "react";
import { FetchFactory } from "typed-api-fetch";
import type {
  ResponseBodySucess,
  FetchParameters,
  SubPaths,
} from "typed-api-fetch";
import { paths } from "./petstore-openapi3";

const fetch = FetchFactory.build<paths>();

export function useGet<
  GetPath extends SubPaths<paths, "get">,
  Operation extends paths[GetPath]["get"]
>(path: GetPath, parameters?: FetchParameters<Operation>) {
  const [data, setData] = useState<ResponseBodySucess<Operation>>();

  useEffect(() => {
    fetchDataFromApi();
  }, [JSON.stringify(parameters)]);

  async function fetchDataFromApi() {
    const response = await fetch(path, { method: "get", parameters } as any);
    if (response.ok) {
      const payload = await response.json();
      setData(payload as ResponseBodySucess<Operation>);
    }
  }

  return data;
}
```

This enables the use of typed API data in a React component

```tsx
import { ChangeEvent, useState } from "react";
import { useGet } from "./useGet";

function MyComponent() {
  const [petId, setPetId] = useState(0);

  const data = useGet("/pet/{petId}", { path: { petId } });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setPetId(parseInt(e.target.value));
  }

  if (!data) {
    return "Nothing to show";
  }

  return (
    <>
      <h1>{data.name}</h1>
      <input type="number" onChange={handleChange} value={petId} />
    </>
  );
}
```

## Acknowledgment

Inspired by [openapi-typescript-fetch](https://github.com/ajaishankar/openapi-typescript-fetch)
