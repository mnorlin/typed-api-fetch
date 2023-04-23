export type InitParameters = {
  baseUrl?: string;
  defaultInit?: Omit<RequestInit, "method">;
  fetchMethod?: typeof fetch;
  parameterSerialization?: { explode?: boolean };
};

export type HttpMethod =
  | "get"
  | "post"
  | "put"
  | "patch"
  | "delete"
  | "head"
  | "options";
