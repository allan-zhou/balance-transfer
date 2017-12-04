var fs = require('fs');
var path = require('path');
var fabricClient = require('fabric-client');
var fabricCaClient = require('fabric-ca-client');
var config = require('../config/config');
var networkConfig = fabricClient.getConfigSetting('network-config');

var clients = {};
var channels = {};
var caClients = {};
// set up the channel objects for each org

for (var key in networkConfig) {
    if (key.indexOf('org') === 0) {
        var client = new fabricClient();

        var cryptoSuite = fabricClient.newCryptoSuite();
        cryptoSuite.setCryptoKeyStore(fabricClient.newCryptoKeyStore({ path: getKeyStoreForOrg(networkConfig[key].name) }));
        client.setCryptoSuite(cryptoSuite);

        var channel = client.newChannel(fabricClient.getConfigSetting('channelName'));

        newOrderer(channel, client);
        newPeer(channel, client, key);

        clients[key] = client;
        channels[key] = channel;

        var caClient = new fabricCaClient(networkConfig[key].ca, null, '', cryptoSuite);
        caClients[key] = caClient;
    }
}

// console.log(clients);
// console.log(channels);
// console.log(caClients);

function newCaClient(org, cryptoSuite) {
    var caClient = new fabricCaClient(org.ca, null, '', cryptoSuite);
    caClients[org.name] = caClient;
}

function newPeer(channel, client, orgName) {
    for (var key in networkConfig[orgName].peers) {
        var tls_cacerts_path = networkConfig[orgName].peers[key].tls_cacerts;
        var data = fs.readFileSync(path.join(__dirname, tls_cacerts_path));

        var peer = client.newPeer(networkConfig[orgName].peers[key].requests, {
            'pem': Buffer.from(data).toString(),
            'ssl-target-name-override': networkConfig[orgName].peers[key]['server-hostname']
        }
        );
        channel.addPeer(peer);
    }
}

function newOrderer(channel, client) {
    var tls_cacerts_path = networkConfig.orderer.tls_cacerts;
    let data = fs.readFileSync(path.join(__dirname, tls_cacerts_path));
    // console.log(Buffer.from(data).toString());
    var orderer = client.newOrderer(networkConfig.orderer.url, {
        'pem': Buffer.from(data).toString(),
        'ssl-target-name-override': networkConfig.orderer['server-hostname']
    }
    );
    channel.addOrderer(orderer);
}

function getKeyStoreForOrg(orgName) {
    return fabricClient.getConfigSetting('keyValueStore') + '_' + orgName;
}


exports.clients = clients;
exports.channels = channels;
exports.caClients = caClients;
exports.getKeyStoreForOrg = getKeyStoreForOrg;