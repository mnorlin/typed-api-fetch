/**
 * Extract the path parameters from an <i>Operation</i>.
 */
export type OperationPathParameters<Operation> = OperationParameters<
  Operation,
  "path"
>;

/**
 * Extract the query parameters from an <i>Operation</i>.
 */
export type OperationQueryParameters<Operation> = OperationParameters<
  Operation,
  "query"
>;

/**
 * Extract the headers from an <i>Operation</i>.
 */
export type OperationHttpHeaders<Operation> = OperationParameters<
  Operation,
  "header"
>;

/**
 * Extract parameters from an <i>Operation</i>.
 */
type OperationParameters<
  Operation,
  ParameterType extends "path" | "query" | "header"
> = Operation extends {
  parameters?: infer AllParameters;
}
  ? AllParameters extends {
      [key in ParameterType]?: infer PathParameters extends Record<
        string,
        string | number
      >;
    }
    ? PathParameters
    : never
  : never;
