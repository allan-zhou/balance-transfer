var hfc = require('fabric-client');
var config = require('../config/config');
var networkConfig = hfc.getConfigSetting('network-config');

var channels = {};
// set up the channel objects for each org

for (var key in networkConfig) {
    if (key.indexOf('org') === 0) {
        var client = new hfc();

        var cryptoSuite = hfc.newCryptoSuite();
        cryptoSuite.setCryptoKeyStore(hfc.newCryptoKeyStore({ path: getKeyStoreForOrg(networkConfig[key].name) }));
        client.setCryptoSuite(cryptoSuite);

        var channel = client.newChannel(hfc.getConfigSetting('channelName'));
        channels[key] = channel;
    }
}

console.log(channels);

for (var key in channels) {
    var channel = channels[key];

    console.log(channel.getName());
    console.log(channel.getOrganizations());
    console.log(channel.getPeers());
    console.log(channel.getOrderers())
}


function getKeyStoreForOrg(org) {
    return hfc.getConfigSetting('keyValueStore' + '_' + org);
}