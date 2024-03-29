import { ResponseByStatus } from "./types/response-body";
import { InitParameters } from "../types/common";
import {
  AllFetchOptions,
  OpenapiPaths,
  FetchOptions,
} from "./types/fetch-options";
import { queryBuilder } from "./query-builder";
import { pathBuilder } from "./path-builder";
import { buildHeaders } from "./header-builder";

export default function createFetch<Paths extends OpenapiPaths<Paths>>(
  options?: InitParameters
) {
  return fetchFactory<Paths>(options);
}

function fetchFactory<Paths>(options?: InitParameters) {
  const basePath = options?.baseUrl ?? "";
  const defaultInit =
    options?.defaultInit ?? ({} as NonNullable<InitParameters["defaultInit"]>);
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

    const headers = buildHeaders(url, defaultInit.headers, options.headers);

    const fetchInit = buildInit(defaultInit, options, headers);
    const response = await fetchMethod(url, fetchInit);
    return response as Omit<Response, "json"> &
      ResponseByStatus<Paths[Path][Method]>;
  }

  return fetcher;
}

function buildInit(
  defaultInit: Omit<RequestInit, "headers">,
  options: AllFetchOptions,
  headers: HeadersInit
): RequestInit {
  const serializableObject =
    options.body &&
    typeof options.body == "object" &&
    !((options.body as any) instanceof FormData);
  return {
    ...Object.assign({}, { ...defaultInit }, { ...options }),
    body: serializableObject ? JSON.stringify(options.body) : options.body,
    method: options.method?.toUpperCase(),
    headers,
  };
}
