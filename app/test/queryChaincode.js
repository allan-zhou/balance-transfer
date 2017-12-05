var fs = require('fs');
var path = require('path');
var fabricClient = require('fabric-client');
var { clients, caClients, channels, getKeyStoreForOrg } = require('./setupPeerAndOrder');
var { getRegisteredUser } = require('./getRegisteredUser');
var networkConfig = fabricClient.getConfigSetting('network-config');

var queryChaincode = function (chaincodeName, fcn, args, username, userOrg) {
    // var client = clients[userOrg];
    var channel = channels[userOrg];

    return getRegisteredUser(username, userOrg, true)
        .then((user) => {
            var request = {
                chaincodeId: chaincodeName,
                fcn: fcn,
                args: args
            };

            return channel.queryByChaincode(request);
        })
        .then((response) => {
            console.log(response);        
            return response;
        })
        .catch((err) => {
            throw err;
        })
}

exports.queryChaincode = queryChaincode;


/* 
 * 测试
 * 
var ccname = 'mycc';
var fcn = 'query';
var args = ["b"];
var username = 'zhangsan31';
var userOrg = 'org1';

queryChaincode(ccname, fcn, args, username, userOrg)
.then((result) => {
    console.log('callback result');
    console.log(result.length);
    for (var key in result) {
        console.log(Buffer.from(result[key]).toString());
    }
})

 */