var fs = require('fs');
var path = require('path');
var fabricClient = require('fabric-client');
var { clients, caClients, channels, getKeyStoreForOrg } = require('./setupPeerAndOrder');
var { getRegisteredUser } = require('./getRegisteredUser');
var networkConfig = fabricClient.getConfigSetting('network-config');

var invokeChaincode = function (chaincodeName, fcn, args, username, userOrg) {
    var client = clients[userOrg];
    var channel = channels[userOrg];

    return getRegisteredUser(username, userOrg, true)
        .then((user) => {
            // send proposal to endorser
            var request = {
                chaincodeId: chaincodeName,
                txId: client.newTransactionID(),
                fcn: fcn,
                args: args
            };

            return channel.sendTransactionProposal(request);
        })
        .then((proposalResponseObject) => {
            var proposalResponses = proposalResponseObject[0];
            var proposal = proposalResponseObject[1];

            var request = {
                proposalResponses: proposalResponses,
                proposal: proposal
            };
            return channel.sendTransaction(request);
        })
        .then((broadcastResponse) => {
            console.log('broadcastResponse');
            console.log(broadcastResponse);
            return broadcastResponse;
        })
        .catch((err) => {
            throw err;
        })

}

exports.invokeChaincode = invokeChaincode;



/* 
 * 测试
 *  
var ccname = 'mycc';
var fcn = 'move';
var args = ["a", "b", "10"];
var username = 'zhangsan31';
var userOrg = 'org1';

invokeChaincode(ccname, fcn, args, username, userOrg)
.then((result) => {
    console.log('callback result');
    console.log(result);
})

 */
