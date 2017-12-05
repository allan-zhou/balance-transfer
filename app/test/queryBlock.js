var fs = require('fs');
var path = require('path');
var fabricClient = require('fabric-client');
var { clients, caClients, channels, getKeyStoreForOrg } = require('./setupPeerAndOrder');
var { getRegisteredUser } = require('./getRegisteredUser');
var networkConfig = fabricClient.getConfigSetting('network-config');

var queryChaininfo = function (username, userOrg) {
    var channel = channels[userOrg];

    return getRegisteredUser(username, userOrg, true)
        .then((user) => {
            // var peer = channel.getPeers()[0];
            // return channel.queryInfo(peer);
            return channel.queryInfo();
        })
        .then((blockchainInfo) => {
            return blockchainInfo;
        })
        .catch((err) => {
            throw err;
        })
}

var queryBlockByNumber = function (blockNumber, username, userOrg) {
    var channel = channels[userOrg];

    return getRegisteredUser(username, userOrg, true)
        .then((user) => {
            return channel.queryBlock(blockNumber);
        })
        .then((block) => {
            return block;
        })
        .catch((err) => {
            throw err;
        })
}

var queryBlockByHash = function (blockHash, username, userOrg) {
    var channel = channels[userOrg];

    return getRegisteredUser(username, userOrg, true)
        .then((user) => {
            return channel.queryBlockByHash(blockHash)
        })
        .then((block) => {
            return block;
        })
        .catch((err) => {
            throw err;
        })
}

var username = 'zhangsan31';
var userOrg = 'org1';

/* 
queryBlockByNumber(2, username, userOrg)
    .then((result) => {
        console.log('callback result');
        console.log(result);
    })
 */


queryChaininfo(username, userOrg)
    .then((result) => {
        console.log('callback result');
        console.log(result);
        for (var key in result) {
            if (key == 'currentBlockHash') {
                // console.log(result[key]);
                queryBlockByHash(result[key], username, userOrg)
                    .then((result) => {
                        console.log('====== block info ======');
                        // console.log(result);
                        console.log(JSON.stringify(result));
                    })
            }
        }
    }) 
