import filterEven from "../src/isEven";

describe("isEven", () => {
  test("passing [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], should be [0, 2, 4, 6, 8, 10]", () => {
    const testcase = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const expected = [0, 2, 4, 6, 8, 10];
    expect(filterEven(testcase)).toStrictEqual(expected);
  });
});
