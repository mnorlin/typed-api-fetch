import { IntRange } from "../../types/utilities";

/**
 * Takes an <i>Operation</i> and creates a type that contains
 * a subset of the Response parameters of the fetch function.
 * Useful for discriminating the union of possible JSON types in the Response
 */
export type ResponseByStatus<Operation> = {
  [K in keyof OperationResponseTypes<Operation>]: {
    status: K;
    ok: K extends IntRange<200, 299> ? true : false;
    json(): Promise<OperationResponseTypes<Operation>[K]>;
  };
}[keyof OperationResponseTypes<Operation>];

/**
 * Extract the respons body of an <i>Operation</i> as a key value pair.
 * The key is the HTTP status code, and value is the JSON body
 * <pre>{ 200: {name: string}, 404: { message: string } }</pre>
 */
export type OperationResponseTypes<
  Operation,
  ContentType extends string = string
> = Operation extends {
  responses: infer Responses;
}
  ? {
      [ResponseType in keyof Responses]: Responses[ResponseType] extends JsonBody<
        infer ResponseBody,
        ContentType
      >
        ? ResponseBody
        : ResponseType extends "default"
        ? Responses[ResponseType]
        : unknown;
    }
  : never;

type JsonBody<ResponseBody, ContentType extends string> = {
  content: { [key in ContentType]: ResponseBody };
};
