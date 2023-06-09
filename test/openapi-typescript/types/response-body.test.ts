import { OperationResponseTypes } from "../../../src/openapi-typescript";
import { operations } from "../test-data/petstore-openapi3";
import { IsEqual } from "../../test-tools";

describe("infer response body", () => {
  it("exist", () => {
    type ResponseTypes = OperationResponseTypes<operations["getOrderById"]>;

    const equals: IsEqual<
      ResponseTypes[200],
      {
        id?: number;
        petId?: number;
        quantity?: number;
        shipDate?: string;
        status?: "placed" | "approved" | "delivered";
        complete?: boolean;
      }
    > = true;

    expect(equals).toBe(true);
  });

  it("does not exist", () => {
    type RequestBody = OperationResponseTypes<operations["getOrderById"]>;
    const equals: IsEqual<RequestBody[404], unknown> = true;

    expect(equals).toBe(true);
  });
});
