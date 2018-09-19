# nVeyancer Network

Implementation of the Hyperledger network component of nVeyancer.

## How-to

Generate the business network archive to deploy and test on Composer Playground.

```sh
# Make sure that you're in the 'nveyancer-network' directory
cd dist
composer archive create --sourceType dir --sourceName ../
```

This command will create a `nveyancer-network@version.bna` file in the `dist/` directory.
