var fs = require('fs');
var path = require('path');
var fabricClient = require('fabric-client');
var { clients, caClients, channels, getKeyStoreForOrg } = require('./setupPeerAndOrder');
var { getOrgAdmin } = require('./getOrgAdmin');
var networkConfig = fabricClient.getConfigSetting('network-config');

var getGenesisBlock = function (userOrg) {
    var client = clients[userOrg];
    var channel = channels[userOrg];

    return getOrgAdmin(userOrg).then((orgAdmin) => {
        var request = {
            txId: client.newTransactionID()
        };

        return channel.getGenesisBlock(request);

    }).then((genesis_block) => {
        return genesis_block;
    })
}

exports.getGenesisBlock = getGenesisBlock;

getGenesisBlock('org1').then((block) => {
    // console.log(data);
    console.log('=======block header==========');
    console.log(block.header);
    console.log('=======block data==========');
    console.log(block.data);
    // for (var key in block.data) {
    //     console.log(block.data[key].toString());
    // }
    console.log('=======block metadata==========');
    console.log(block.metadata);
})
