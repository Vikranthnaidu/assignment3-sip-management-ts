import { sum } from "../controller/testing";

describe("testing Authentication related", () => {
  test("User Login validation", () => {
    const user = {
      email: "vicky@gmail.com",
      password: "123456",
    };

    expect(user.email).toBeDefined();

    expect(user.password).not.toBeNull();
  });

  test("User Object matching", () => {
    const user = {
      email: "mdurga@gmail.com",
      password: null,
    };

    expect(user).toEqual({
      email: "mdurga@gmail.com",
      password: null,
    });
  });
});

test("If 2+2 is added result should be 4", () => {
  expect(sum(2, 2)).toBe(4);
});
