import { ResponseByStatus } from "./types/response-body";
import { InitParameters } from "../types/common";
import {
  AllFetchOptions,
  OpenapiPaths,
  FetchOptions,
} from "./types/fetch-options";

export const FetchFactory = {
  build: <Paths extends OpenapiPaths<Paths>>(options?: InitParameters) => {
    return fetchFactory<Paths>(options);
  },
};

function fetchFactory<Paths>(options?: InitParameters) {
  const basePath = options?.baseUrl ?? "";
  const defaultInit = options?.defaultInit ?? {};
  const fetchMethod = options?.fetchMethod ?? fetch;

  async function fetcher<
    Path extends keyof Paths,
    Method extends keyof Paths[Path],
    Operation extends Paths[Path][Method]
  >(input: Path, init: { method: Method } & FetchOptions<Operation>) {
    const options = init as unknown as { method: Method } & AllFetchOptions;

    const path = getPath(input as string, options.parameters?.path);
    const query = getQuery(options.parameters?.query);
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
    method: (options.method ?? "GET").toUpperCase(),
    headers: Object.assign({}, defaultInit.headers, options.headers),
  };
}

function getPath(path: string, pathParams?: Record<string, string | number>) {
  if (!pathParams) {
    return path;
  }
  return path.replace(/\{([^}]+)\}/g, (_, key) => {
    const value = encodeURIComponent(pathParams[key] as string);
    return value;
  });
}

function getQuery(
  params?: Record<string, string | number | string[] | number[]>
): string {
  if (!params) {
    return "";
  }

  const searchParams = Object.entries(params).map(([key, value]) => {
    if (Array.isArray(value)) {
      return value
        .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(`${v}`)}`)
        .join("&");
    }
    return `${encodeURIComponent(key)}=${encodeURIComponent(`${params[key]}`)}`;
  });

  return "?" + searchParams.join("&");
}
