var fs = require('fs');
var path = require('path');
var fabricClient = require('fabric-client');
var { clients, caClients, channels, getKeyStoreForOrg } = require('./setupPeerAndOrder');
var { getOrgAdmin } = require('./getOrgAdmin');
var networkConfig = fabricClient.getConfigSetting('network-config');

var joinChannel = function (userOrg) {
    var client = clients[userOrg];
    var channel = channels[userOrg];

    return getOrgAdmin(userOrg)
        .then((orgAdmin) => {
            var request = {
                txId: client.newTransactionID()
            };
            return channel.getGenesisBlock(request);
        })
        .then((genesis_block) => {
            var request = {
                targets: channel.getPeers(),
                txId: client.newTransactionID(),
                block: genesis_block
            };
            return channel.joinChannel(request);
        })
        .then((result) => {
            console.log(result);
            return result;
        })
        .catch((err) => {
            throw err;
        })
}

exports.joinChannel = joinChannel;

// joinChannel('org2').then((result) => {
//     console.log('call back result:' + result);
// })


/*
 *  join result
 *
[ { version: 0,
    timestamp: null,
    response: { status: 200, message: '', payload: <Buffer > },
    payload: <Buffer >,
    endorsement: null },
  { version: 0,
    timestamp: null,
    response: { status: 200, message: '', payload: <Buffer > },
    payload: <Buffer >,
    endorsement: null } ]
*/
