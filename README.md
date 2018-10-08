# nVeyancer Network

Implementation of the Hyperledger network component of nVeyancer.

## How-to

### Generate business network archive (BNA file)

Generate the business network archive to deploy and test on Composer Playground.

```sh
# Make sure that you're in the 'nveyancer-network' directory
cd dist
composer archive create --sourceType dir --sourceName ../
cd ..
```

This command will create a `nveyancer-network@VERSION.bna` file in the `dist/` directory.

### Deploy BNA file

Go back to the main folder `nveyancer-network`, then use this command to install the generated
BNA file. Change the `VERSION` to the current version of the network.

```sh
# Install the generated BNA file
composer network install \
--card "PeerAdmin@hlfv1" \
--archiveFile dist/nveyancer-network@VERSION.bna

# Start the network
composer network start \
--networkName "nveyancer-network" \
--networkVersion VERSION \
--networkAdmin admin \
--networkAdminEnrollSecret adminpw \
--card PeerAdmin@hlfv1 \
--file dist/nvey-networkadmin.card

# Then import the created card
composer card import --file dist/nvey-networkadmin.card

# If you want to test if the card has gone live
composer network ping --card admin@nveyancer-network
```

### Run REST server

Use the following command (with answers stated next to the questions)

```sh
composer-rest-server

# It will ask you the following questions
? Enter the name of the business network card to use: admin@nveyancer-network
? Specify if you want namespaces in the generated REST API: never use namespaces
? Specify if you want to use an API key to secure the REST API: No
? Specify if you want to enable authentication for the REST API using Passport: No
? Specify if you want to enable event publication over WebSockets: Yes
? Specify if you want to enable TLS security for the REST API: No

# If everything is okay, the following logs should appear
To restart the REST server using the same options, issue the following command:
   composer-rest-server -c admin@nveyancer-network -n never -w true

Discovering types from business network definition ...
Discovering the Returning Transactions..
Discovered types from business network definition
Generating schemas for all types in business network definition ...
Generated schemas for all types in business network definition
Adding schemas for all types to Loopback ...
Added schemas for all types to Loopback
Web server listening at: http://localhost:3000
Browse your REST API at http://localhost:3000/explorer
```

### Upgrade the business network

When the business model (CTO files) is updated, the current deployed business network
needs to be upgraded to apply the new changes (even local networks). The steps are as follow:

1. Pump the version number of the network in `package.json` file.
2. Use the commands in [this section](#generate-business-network-archive-bna-file) to
generate new BNA file.
3. Install and upgrade to the business network

```sh
# Install the generated BNA file in step 2
composer network install \
--card "PeerAdmin@hlfv1" \
--archiveFile dist/nveyancer-network@0.0.3a.bna

# Upgrade the current network
# Change the VERSION to the current version
composer network upgrade \
--card "PeerAdmin@hlfv1" \
--networkName "nveyancer-network" \
--networkVersion 0.0.3a
```

If you want to, you can turn off the REST server then turn it on again using the same parameters.


## Deployment

We will use IBM Cloud to deploy. For now, just follow this [tutorial](https://hackernoon.com/deploy-a-business-network-on-free-ibm-blockchain-starter-plan-93fafb3dd997).

The commands below are pasted from said tutorial to be input into the terminal.

```sh
# Step 6
# Create admin business network card
composer card create \
--file dist/ibm_admin.card
-
```
