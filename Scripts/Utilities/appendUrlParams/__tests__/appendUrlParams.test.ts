import appendUrlParams from "../appendUrlParams";

describe("appendUrlParams", () => {
  describe("when url contains a question mark", () => {
    it("should append the params with an ampersand", () => {
      const url = "http://foo.bar?param1=value1";
      const params = {
        param2: "value2",
        param3: 3,
      };
      expect(appendUrlParams(params, url)).toEqual("http://foo.bar?param1=value1&param2=value2&param3=3");
    });
  });

  describe("when url does _not_ contain a question mark", () => {
    it("should append the params with a question mark", () => {
      const url = "http://foo.bar";
      const params = {
        param2: "value2",
        param3: 3,
      };
      expect(appendUrlParams(params, url)).toEqual("http://foo.bar?param2=value2&param3=3");
    });
  });

  describe("when params is a string instead of an object", () => {
    describe("and url does contain a question mark", () => {
      it("should append the string", () => {
        const url = "http://foo.bar?param1=value1";
        const params = "param2=value2&param3=3";
        expect(appendUrlParams(params, url)).toEqual("http://foo.bar?param1=value1&param2=value2&param3=3");
      });
    });
    describe("and url does not contain a question mark", () => {
      it("should append the string", () => {
        const url = "http://foo.bar";
        const params = "param2=value2&param3=3";
        expect(appendUrlParams(params, url)).toEqual("http://foo.bar?param2=value2&param3=3");
      });
    });
  });

  describe("when params is any other type", () => {
    describe("and url does contain a question mark", () => {
      it("should return the `toString()` value of the param and log an error to the console", () => {
        const consoleSpy = jest.spyOn(global.console, "error").mockImplementation(() => {});
        const url = "http://foo.bar?param1=value1";
        const params = ["param2", "value2"];
        expect(appendUrlParams(params, url)).toEqual("http://foo.bar?param1=value1&param2,value2");
        // @ts-ignore
        expect(consoleSpy.mock.calls).toMatchSnapshot();
        consoleSpy.mockRestore();
      });
    });
  });
});
