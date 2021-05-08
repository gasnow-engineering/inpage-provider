# Gasnow Inpage Provider

The inpage Ethereum provider object injected by Gasnow into web pages.
Contains a lot of implementation details specific to Gasnow, and is probably
not suitable for out-of-the-box use with other wallets.

Implements the Ethereum JavaScript provider specification, [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193).

## Installation

`yarn add @gasnow/inpage-provider`

## Usage

```javascript
import { initializeProvider } from "@gasnow/inpage-provider";

// Create a stream to a remote provider:
const gasnowStream = new LocalMessageDuplexStream({
  name: "inpage",
  target: "contentscript",
});

// this will initialize the provider and set it as window.ethereum
initializeProvider({
  connectionStream: gasnowStream,
});

const { gasnow } = window;
```

### Types

Types are exposed at `index.d.ts`.
They require Node.js `EventEmitter` and `Duplex` stream types, which you can grab from e.g. [`@types/node`](https://npmjs.com/package/@types/node).

### Do Not Modify the Provider

The Provider object should not be mutated by consumers under any circumstances.
The maintainers of this package will neither fix nor take responsbility for bugs caused by third parties mutating the provider object.

## Running tests

```bash
yarn test
```
