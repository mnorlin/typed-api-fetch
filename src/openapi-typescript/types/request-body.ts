/**
 * Extract the request body from an <i>Operation</i>.
 */
export type OperationRequestBody<
  Operation,
  ContentType extends string = string,
> = Operation extends {
  requestBody?: { content: { [key in ContentType]: infer RequestBody } };
}
  ? RequestBody
  : never;
