import { pathBuilder } from "../../src/openapi-typescript/path-builder";

describe("Path parameter serialization", () => {
  describe("explode=false", () => {
    it("resolves simple path parameter", () => {
      const pBuilder = pathBuilder({ style: "simple", explode: false });
      const path = pBuilder.getPath("/pet/{petId}", { petId: 42 });

      expect(path).toBe("/pet/42");
    });

    it("resolves array parameter", () => {
      const pBuilder = pathBuilder({ style: "simple", explode: false });
      const path = pBuilder.getPath("/pet/{petId}", { petId: [42, 53] });

      expect(path).toBe("/pet/42,53");
    });

    it("resolves object parameter", () => {
      const pBuilder = pathBuilder({ style: "simple", explode: false });
      const path = pBuilder.getPath("/pet/{petId}", {
        petId: { hello1: "world1", hello2: "world2" },
      });

      expect(path).toBe("/pet/hello1,world1,hello2,world2");
    });
  });

  describe("explode=true", () => {
    it("resolves object parameter", () => {
      const pBuilder = pathBuilder({ style: "simple", explode: true });
      const path = pBuilder.getPath("/pet/{petId}", {
        petId: { hello1: "world1", hello2: "world2" },
      });

      expect(path).toBe("/pet/hello1=world1,hello2=world2");
    });
  });
});
