import { getUser } from "../models/userModel";

describe("Test Authentication related", () => {
  test("Try testing the valid investor", () => {
    return getUser("INV001").then((data) => {
      const d = JSON.stringify(data);
      console.log(`Inestor Data: ${d}`);
      expect(data).not.toBeNull();
      expect(data.first_name).not.toBeNull();
    });
  });
});
