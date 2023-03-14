import { ResponseByStatus } from "./types/response-body";
import { InitParameters } from "../types/common";
import {
  FetchOptions,
  OpenapiPaths,
  OptionalFetchOptions,
} from "./types/fetch";

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
  >(
    input: Path,
    init: { method: Method } & OptionalFetchOptions<Operation, Method>
  ) {
    const options = init as FetchOptions;

    const path = getPath(input as string, options.parameters?.path);
    const query = getQuery(options.parameters?.query);
    const url = basePath + path + query;

    const fetchInit = buildInit(defaultInit, options);
    const response = await fetchMethod(url, fetchInit);

    return {
      ...response,
      ok: response.ok,
      status: response.status,
    } as Omit<Response, "json"> & ResponseByStatus<Paths[Path][Method]>;
  }

  return fetcher;
}

function buildInit(
  defaultInit: RequestInit,
  options: FetchOptions
): RequestInit {
  return {
    ...Object.assign({}, { ...defaultInit }, { ...options }),
    body: options.body ? JSON.stringify(options.body) : undefined,
    method: options.method as string,
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

function getQuery(params?: Record<string, string | number>): string {
  if (!params) {
    return "";
  }
  const searchParams = new URLSearchParams(params as Record<string, string>);
  return Object.keys(params).length == 0 ? "" : `?${searchParams.toString()}`;
}
