var hfc = require('fabric-client');
var config = require('../config/config');
var networkConfig = hfc.getConfigSetting('network-config');

// set up the client objects for each org
var clients = {};
// console.log(networkConfig);

for (var key in networkConfig) {
    if (key.indexOf('org') === 0) {        
        var client = new hfc();

        var cryptoSuite = hfc.newCryptoSuite();
        cryptoSuite.setCryptoKeyStore(hfc.newCryptoKeyStore({ path: getKeyStoreForOrg(networkConfig[key].name) }));
        client.setCryptoSuite(cryptoSuite);

        clients[key] = client;
    }
}

console.log(clients);

function getKeyStoreForOrg(org) {
    return hfc.getConfigSetting('keyValueStore' + '_' + org);
}