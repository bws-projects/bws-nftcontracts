## How to deploy

- run ```npx hardhat run --network <your-network> scripts/deploy.js```

### Setting your keys

- check your key and network url is setup in .env file as for example:

```sh
MUMBAI_WALLET_KEY=affb....31f8ec
MUMBAI_CONTRACT_OWNER=0x908....6F4bDaC7
MUMBAI_HTTP_ENDPOINT=https://rpc-mumbai.maticvigil.com/v1/07beabe6....c2305aa6
```

- check hardhat.config.js contains your network setup as:

```js
 networks: {
    mumbai: {
      url: process.env.MUMBAI_HTTP_ENDPOINT,
      accounts: [process.env.MUMBAI_WALLET_KEY],
    },
  }
```