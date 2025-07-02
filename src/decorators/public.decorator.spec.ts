import "reflect-metadata";
import { Public, IS_PUBLIC_KEY } from "./public.decorator";

describe("Public decorator", () => {
  it("should set metadata key IS_PUBLIC_KEY to true on class", () => {
    @Public()
    class TestClass {}

    const metadata = Reflect.getMetadata(IS_PUBLIC_KEY, TestClass);

    expect(metadata).toBe(true);
  });

  it("should set metadata key IS_PUBLIC_KEY to true on method", () => {
    class TestClass {
      @Public()
      testMethod() {
        console.log('test');
      }
    }

    const metadata = Reflect.getMetadata(
      IS_PUBLIC_KEY,
      TestClass.prototype,
      "testMethod"
    );

    expect(metadata).toBe(true);
  });
});
