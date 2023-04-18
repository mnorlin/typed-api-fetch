import { ResponseByStatus } from "./types/response-body";
import { InitParameters } from "../types/common";
import { OpenapiPaths, FetchOptions } from "./types/fetch-options";
export declare const FetchFactory: {
    build: <Paths extends OpenapiPaths<Paths>>(options?: InitParameters) => <Path extends keyof Paths, Method extends keyof Paths[Path], Operation extends Paths[Path][Method]>(input: Path, init: {
        method: Method;
    } & FetchOptions<Operation>) => Promise<Omit<Response, "json"> & ResponseByStatus<Paths[Path][Method]>>;
};
