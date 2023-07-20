export function buildHeaders(
  resolvedPath: string,
  defaultHeaders?:
    | RequestInitHeaders
    | ((pathInfo: { resolvedPath: string }) => RequestInitHeaders),
  headers?: RequestInitHeaders
) {
  const resolvedDefaultHeaders =
    typeof defaultHeaders === "function"
      ? defaultHeaders({ resolvedPath })
      : defaultHeaders;

  const mergedHeaders = [
    ...headerToEntries(resolvedDefaultHeaders),
    ...headerToEntries(headers),
  ];

  return Object.fromEntries(mergedHeaders);
}

function headerToEntries(
  headers?: Headers | [string, string][] | Record<string, string>
): [string, string][] {
  if (!headers) {
    return [];
  }
  if (Array.isArray(headers)) {
    return headers;
  }

  if (headers instanceof Headers) {
    return Array.from(headers.entries());
  }

  return Object.entries(headers);
}

type RequestInitHeaders = Headers | [string, string][] | Record<string, string>;
