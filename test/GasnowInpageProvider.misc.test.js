const { GasnowInpageProvider } = require("../dist");
const { default: messages } = require("../dist/messages");

const MockDuplexStream = require("./mocks/DuplexStream");

describe("GasnowInpageProvider: Miscellanea", () => {
  describe("constructor", () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });

    afterAll(() => {
      jest.runAllTimers();
    });

    it("succeeds if stream is provided", () => {
      expect(
        () => new GasnowInpageProvider(new MockDuplexStream())
      ).not.toThrow();
    });

    it("succeeds if stream and valid options are provided", () => {
      const stream = new MockDuplexStream();

      expect(
        () =>
          new GasnowInpageProvider(stream, {
            maxEventListeners: 10,
          })
      ).not.toThrow();

      expect(
        () =>
          new GasnowInpageProvider(stream, {
            shouldSendMetadata: false,
          })
      ).not.toThrow();

      expect(
        () =>
          new GasnowInpageProvider(stream, {
            maxEventListeners: 10,
            shouldSendMetadata: false,
          })
      ).not.toThrow();
    });

    it("throws if no or invalid stream is provided", () => {
      expect(() => new GasnowInpageProvider()).toThrow(
        messages.errors.invalidDuplexStream()
      );

      expect(() => new GasnowInpageProvider("foo")).toThrow(
        messages.errors.invalidDuplexStream()
      );

      expect(() => new GasnowInpageProvider({})).toThrow(
        messages.errors.invalidDuplexStream()
      );
    });

    it("accepts valid custom logger", () => {
      const stream = new MockDuplexStream();
      const customLogger = {
        debug: console.debug,
        error: console.error,
        info: console.info,
        log: console.log,
        trace: console.trace,
        warn: console.warn,
      };

      expect(
        () =>
          new GasnowInpageProvider(stream, {
            logger: customLogger,
          })
      ).not.toThrow();
    });
  });

  describe("isConnected", () => {
    it("returns isConnected state", () => {
      jest.useFakeTimers();
      const provider = new GasnowInpageProvider(new MockDuplexStream());
      provider.autoRefreshOnNetworkChange = false;

      expect(provider.isConnected()).toBe(false);

      provider._state.isConnected = true;

      expect(provider.isConnected()).toBe(true);

      provider._state.isConnected = false;

      expect(provider.isConnected()).toBe(false);

      jest.runAllTimers();
    });
  });
});
