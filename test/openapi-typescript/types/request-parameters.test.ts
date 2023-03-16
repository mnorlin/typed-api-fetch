import {
  OperationHttpHeaders,
  OperationPathParameters,
  OperationQueryParameters,
} from "../../../src/openapi-typescript/types/request-parameters";
import { operations } from "../test-data/petstore-openapi3";
import { IsNever, IsEqual } from "../../test-tools";

describe("infer parameter", () => {
  describe("path", () => {
    it("exist", () => {
      type PathParameters = OperationPathParameters<operations["getPetById"]>;
      const equals: IsEqual<PathParameters, { petId: number }> = true;

      expect(equals).toBe(true);
    });

    it("does not exist", () => {
      type PathParameters = OperationPathParameters<operations["addPet"]>;
      const never: IsNever<PathParameters> = true;

      expect(never).toBe(true);
    });
  });

  describe("query", () => {
    it("exist", () => {
      type QueryParameters = OperationQueryParameters<
        operations["findPetsByStatus"]
      >;
      const equals: IsEqual<
        QueryParameters,
        { status?: "available" | "pending" | "sold" }
      > = true;

      expect(equals).toBe(true);
    });

    it("does not exist", () => {
      type QueryParameters = OperationQueryParameters<operations["addPet"]>;
      const never: IsNever<QueryParameters> = true;

      expect(never).toBe(true);
    });
  });

  describe("header", () => {
    it("exist", () => {
      type HeaderParameters = OperationHttpHeaders<operations["deletePet"]>;
      const equals: IsEqual<HeaderParameters, { api_key?: string }> = true;

      expect(equals).toBe(true);
    });

    it("does not exist", () => {
      type HeaderParameters = OperationHttpHeaders<operations["addPet"]>;
      const never: IsNever<HeaderParameters> = true;

      expect(never).toBe(true);
    });
  });
});
