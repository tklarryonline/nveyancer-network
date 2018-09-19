# nVeyancer Network

Implementation of the Hyperledger network component of nVeyancer.

## How-to

### Generate business network archive (BNA file)

Generate the business network archive to deploy and test on Composer Playground.

```sh
# Make sure that you're in the 'nveyancer-network' directory
cd dist
composer archive create --sourceType dir --sourceName ../
```

This command will create a `nveyancer-network@version.bna` file in the `dist/` directory.

### Deploy BNA file

Go back to the main folder `nveyancer-network`, then use this command to install the generated
BNA file.

```sh
# Install the generated BNA file
composer network install \
--card "PeerAdmin@hlfv1" \
--archiveFile dist/nveyancer-network@0.0.1.bna

# Start the network
composer network start \
--networkName "nveyancer-network" \
--networkVersion 0.0.1 \
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
