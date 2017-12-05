var fs = require('fs');
var path = require('path');
var fabricClient = require('fabric-client');
var { clients, caClients, channels, getKeyStoreForOrg } = require('./setupPeerAndOrder');
var { getOrgAdmin } = require('./getOrgAdmin');
var networkConfig = fabricClient.getConfigSetting('network-config');

var instantiateChaincode = function (chaincodeName, chaincodeVersion, args, username, userOrg) {
    var client = clients[userOrg];
    var channel = channels[userOrg];

    return getOrgAdmin(userOrg)
        .then((orgAdmin) => {
            return channel.initialize();
        })
        .then((result) => {
            console.log('initialize');
            console.log(result);
            var request = {
                chaincodeId: chaincodeName,
                chaincodeVersion: chaincodeVersion,
                args: args,
                txId: client.newTransactionID(),
                fcn: 'init'
            };

            return channel.sendInstantiateProposal(request);
        })
        .then((proposalResponseObject) => {
            console.log('proposalResponseObject');
            console.log(proposalResponseObject);
            var proposalResponses = proposalResponseObject[0];
            var proposal = proposalResponseObject[1];

            var request = {
                proposalResponses: proposalResponses,
                proposal: proposal
            };
            return channel.sendTransaction(request);
        })
        .then((broadcastResponse) => {
            console.log(broadcastResponse);
            return broadcastResponse;
        })
        .catch((err) => {
            throw err;
        })
}

exports.instantiateChaincode = instantiateChaincode;


var channelName = fabricClient.getConfigSetting('channelName');
var ccname = 'mycc';
var ccversion = 'v0.0.1';
var args = ["a","100","b","200"];
var username = 'zhangsan31';
var userOrg = 'org2';

instantiateChaincode(ccname, ccversion, args, username, userOrg)
    .then((result) => {
        console.log('callback result');
        console.log(result);
    })

