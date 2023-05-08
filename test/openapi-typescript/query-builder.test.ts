import { queryBuilder } from "../../src/openapi-typescript/query-builder";

describe("Query parameter serialization", () => {
  describe("explode=false", () => {
    it("resolves array as comma separated string", () => {
      const qBuilder = queryBuilder({ explode: false, style: "form" });
      const query = qBuilder.getQuery({ status: ["available", "free"] });

      expect(query).toBe("?status=available,free");
    });

    it("resolves array as pipe separated string", () => {
      const qBuilder = queryBuilder({ explode: false, style: "pipeDelimited" });
      const query = qBuilder.getQuery({ status: ["available", "free"] });

      expect(query).toBe("?status=available|free");
    });

    it("resolves array as pipe separated string", () => {
      const qBuilder = queryBuilder({
        explode: false,
        style: "spaceDelimited",
      });
      const query = qBuilder.getQuery({ status: ["available", "free"] });

      expect(query).toBe("?status=available%20free");
    });

    it("resolves object as comma separated key+value string", () => {
      const qBuilder = queryBuilder({ explode: false, style: "form" });
      const query = qBuilder.getQuery({
        groupType: { status: "available", status2: "free" },
      });

      expect(query).toBe("?groupType=status,available,status2,free");
    });
  });

  describe("explode=true", () => {
    it("resolves array as duplicated keys", () => {
      const qBuilder = queryBuilder({ explode: true, style: "form" });
      const query = qBuilder.getQuery({ status: ["available", "free"] });

      expect(query).toBe("?status=available&status=free");
    });

    it("resolves object by spreading its values", () => {
      const qBuilder = queryBuilder({ explode: true, style: "form" });
      const query = qBuilder.getQuery({
        groupType: { status: "available", status2: "free" },
      });

      expect(query).toBe("?status=available&status2=free");
    });
  });
});
