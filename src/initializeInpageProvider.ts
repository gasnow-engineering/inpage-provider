import { Duplex } from 'stream';
import MetaMaskInpageProvider from './MetaMaskInpageProvider';

import GasnowInpageProvider, {
  GasnowInpageProviderOptions,
} from './GasnowInpageProvider'; // GasnowInpageProviderOptions,
import shimWeb3 from './shimWeb3';

interface InitializeProviderOptions extends GasnowInpageProviderOptions {
  /**
   * The stream used to connect to the wallet.
   */
  connectionStream: Duplex;

  /**
   * Whether the provider should be set as window.ethereum.
   */
  shouldSetOnWindow?: boolean;

  /**
   * Whether the provider should be compatible for gasnow.
   */
  shouldCompatible?: boolean;
}

/**
 * Initializes a GasnowInpageProvider and (optionally) assigns it as window.ethereum.
 *
 * @param options - An options bag.
 * @param options.connectionStream - A Node.js stream.
 * @param options.jsonRpcStreamName - The name of the internal JSON-RPC stream.
 * @param options.maxEventListeners - The maximum number of event listeners.
 * @param options.shouldCompatible
 * @param options.shouldSendMetadata - Whether the provider should send page metadata.
 * @param options.shouldSetOnWindow - Whether the provider should be set as window.ethereum.
//  * @param options.shouldShimWeb3 - Whether a window.web3 shim should be injected.
 * @returns The initialized provider (whether set or not).
 */
export function initializeProvider({
  connectionStream,
  jsonRpcStreamName,
  logger = console,
  maxEventListeners = 100,
  shouldCompatible = true,
  shouldSendMetadata = true,
  shouldSetOnWindow = true,
}: InitializeProviderOptions): GasnowInpageProvider {
  if (
    shouldCompatible &&
    typeof (window as Record<string, any>).ethereum === 'undefined'
  ) {
    let metaMaskProvider = new MetaMaskInpageProvider(connectionStream, {
      jsonRpcStreamName,
      logger,
      maxEventListeners,
      shouldSendMetadata,
    });
    metaMaskProvider = new Proxy(metaMaskProvider, {
      // some common libraries, e.g. web3@1.x, mess with our API
      deleteProperty: () => true,
    });

    (window as Record<string, any>).ethereum = metaMaskProvider;
    window.dispatchEvent(new Event('ethereum#initialized'));
    shimWeb3(metaMaskProvider, logger);
  }
  let provider = new GasnowInpageProvider(connectionStream, {
    jsonRpcStreamName,
    logger,
    maxEventListeners,
    shouldSendMetadata,
  });
  provider = new Proxy(provider, {
    // some common libraries, e.g. web3@1.x, mess with our API
    deleteProperty: () => true,
  });

  if (shouldSetOnWindow) {
    setGlobalProvider(provider);
  }

  return provider;
}

/**
 * Sets the given provider instance as window.ethereum and dispatches the
 * 'ethereum#initialized' event on window.
 *
 * @param providerInstance - The provider instance.
 */
export function setGlobalProvider(
  providerInstance: GasnowInpageProvider,
): void {
  (window as Record<string, any>).gasnow = providerInstance;
  window.dispatchEvent(new Event('gasnow#initialized'));
}
