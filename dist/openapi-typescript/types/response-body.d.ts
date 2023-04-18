import { Immutable, IntRange } from "../../types/utilities";
/**
 * Takes an <i>Operation</i> and creates a type that contains
 * a subset of the Response parameters of the fetch function.
 * Useful for discriminating the union of possible JSON types in the Response
 */
export type ResponseByStatus<Operation> = {
    [K in keyof OperationResponseTypes<Operation>]: {
        readonly status: K;
        readonly ok: K extends IntRange<200, 299> ? true : false;
        readonly json: () => Promise<OperationResponseTypes<Operation>[K] extends object ? Immutable<OperationResponseTypes<Operation>[K]> : never>;
    };
}[keyof OperationResponseTypes<Operation>];
/**
 * Extract the respons body of an <i>Operation</i> as a key value pair.
 * The key is the HTTP status code, and value is the JSON body
 * <pre>{ 200: {name: string}, 404: { message: string } }</pre>
 */
export type OperationResponseTypes<Operation, ContentType extends string = string> = Operation extends {
    responses: infer Responses;
} ? {
    [ResponseType in keyof Responses]: Responses[ResponseType] extends JsonBody<infer ResponseBody, ContentType> ? ResponseBody : ResponseType extends "default" ? Responses[ResponseType] : unknown;
} : never;
type JsonBody<ResponseBody, ContentType extends string> = {
    content: {
        [key in ContentType]: ResponseBody;
    };
};
/**
 * Extracts the type of a response body, based on the HTTP status code
 */
export type ResponseBody<Operation, StatusCode = "default"> = StatusCode extends keyof OperationResponseTypes<Operation> ? OperationResponseTypes<Operation>[StatusCode] : never;
/**
 * Returns the response body for successful requests.
 * It ensures that only successful responses (status code of 2XX) are considered.
 */
export type ResponseBodySuccess<Operation> = ResponseBody<Operation, IntRange<200, 299>>;
/**
 * Returns the response body for unsuccessful requests.
 * It ensures that only error responses (status code of 300-599) are considered.
 */
export type ResponseBodyError<Operation> = ResponseBody<Operation, IntRange<300, 599>>;
export {};
