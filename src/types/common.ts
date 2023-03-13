export type InitParameters = {
  baseUrl?: string;
  defaultInit?: Omit<RequestInit, "method">;
  fetchMethod?: typeof fetch;
};
