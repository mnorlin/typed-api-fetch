import { OperationRequestBody } from "../../../src/openapi-typescript";
import { operations } from "../test-data/petstore-openapi3";
import { IsNever, Same } from "../../test-tools";

describe("infer request body", () => {
  it("exist", () => {
    type RequestBody = OperationRequestBody<operations["placeOrder"]>;
    const same: Same<
      RequestBody,
      {
        id?: number;
        petId?: number;
        quantity?: number;
        shipDate?: string;
        status?: "placed" | "approved" | "delivered";
        complete?: boolean;
      }
    > = true;

    expect(same).toBe(true);
  });

  it("does not exist", () => {
    type RequestBody = OperationRequestBody<operations["getOrderById"]>;
    const never: IsNever<RequestBody> = true;

    expect(never).toBe(true);
  });
});
