import { ResponseByStatus } from "./types/response-body";
import { InitParameters } from "../types/common";
import {
  AllFetchOptions,
  OpenapiPaths,
  FetchOptions,
} from "./types/fetch-options";
import { queryBuilder } from "./query-builder";
import { pathBuilder } from "./path-builder";

export const FetchFactory = {
  build: <Paths extends OpenapiPaths<Paths>>(options?: InitParameters) => {
    return fetchFactory<Paths>(options);
  },
};

function fetchFactory<Paths>(options?: InitParameters) {
  const basePath = options?.baseUrl ?? "";
  const defaultInit = options?.defaultInit ?? {};
  const fetchMethod = options?.fetchMethod ?? fetch;
  const serialization = options?.parameterSerialization;

  async function fetcher<
    Path extends keyof Paths,
    Method extends keyof Paths[Path],
    Operation extends Paths[Path][Method]
  >(input: Path, init: { method: Method } & FetchOptions<Operation>) {
    const options = init as unknown as { method: Method } & AllFetchOptions;

    const qBuilder = queryBuilder({
      style: serialization?.query?.style ?? "form",
      explode: serialization?.query?.explode ?? false,
    });

    const pBuilder = pathBuilder({
      style: serialization?.path?.style ?? "simple",
      explode: serialization?.path?.explode ?? false,
    });

    const path = pBuilder.getPath(
      input as string,
      options.parameters?.path ?? null
    );
    const query = qBuilder.getQuery(options.parameters?.query ?? null);
    const url = basePath + path + query;

    const fetchInit = buildInit(defaultInit, options);
    const response = await fetchMethod(url, fetchInit);
    return new Response(
      [101, 204, 205, 304].includes(response.status) ? null : response.body,
      {
        status: response.status,
        headers: response.headers,
        statusText: response.statusText,
      }
    ) as Omit<Response, "json"> & ResponseByStatus<Paths[Path][Method]>;
  }

  return fetcher;
}

function buildInit(
  defaultInit: RequestInit,
  options: AllFetchOptions
): RequestInit {
  return {
    ...Object.assign({}, { ...defaultInit }, { ...options }),
    body: options.body ? JSON.stringify(options.body) : undefined,
    method: options.method?.toUpperCase(),
    headers: Object.assign({}, defaultInit.headers, options.headers),
  };
}
