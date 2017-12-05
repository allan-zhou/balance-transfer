var fs = require('fs');
var path = require('path');
var fabricClient = require('fabric-client');
var { clients, caClients, channels, getKeyStoreForOrg } = require('./setupPeerAndOrder');
var { getRegisteredUser } = require('./getRegisteredUser');
var networkConfig = fabricClient.getConfigSetting('network-config');

var queryTransactionById = function (txId, username, userOrg) {
    var channel = channels[userOrg];

    return getRegisteredUser(username, userOrg, true)
        .then((user) => {
            return channel.queryTransaction(txId);
        })
        .then((response) => {
            return response;
        })
        .catch((err) => {
            throw err;
        });
}


var txId = '12b12af4c0a6b0b40853aef8eb0e9c8b9fb8ab7e7715c5a2b7230b5fb407327b';
var username = 'zhangsan31';
var userOrg = 'org1';

queryTransactionById(txId, username, userOrg)
    .then((result) => {
        console.log('callback result');
        // console.log(result);
        console.log(JSON.stringify(result));
    })
