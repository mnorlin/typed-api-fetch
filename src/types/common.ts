export type InitParameters = {
  baseUrl?: string;
  defaultInit?: Omit<RequestInit, "method" | "headers"> & {
    headers:
      | HeadersInit
      | ((pathInfo: { resolvedPath: string }) => HeadersInit);
  };
  fetchMethod?: typeof fetch;
  parameterSerialization?: {
    path?: { explode?: boolean; style?: PathSerializationStyle };
    query?: { explode?: boolean; style?: QuerySerializationStyle };
  };
};

export type QuerySerializationStyle =
  | "form"
  | "spaceDelimited"
  | "pipeDelimited";
// | "deepObject"

export type PathSerializationStyle = "simple";
//| "label"
//| "matrix"

export type HttpMethod =
  | "get"
  | "post"
  | "put"
  | "patch"
  | "delete"
  | "head"
  | "options";
