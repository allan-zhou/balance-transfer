var fs = require('fs');
var path = require('path');
var fabricClient = require('fabric-client');
var { clients, caClients, channels, getKeyStoreForOrg } = require('./setupPeerAndOrder');
var { getOrgAdmin } = require('./getOrgAdmin');
var networkConfig = fabricClient.getConfigSetting('network-config');

var installChaincode = function (chaincodeName, chaincodePath, chaincodeVersion, username, userOrg) {
    var client = clients[userOrg];
    var channel = channels[userOrg];

    setupChaincodeDeploy();

    return getOrgAdmin(userOrg)
        .then((orgAdmin) => {
            var request = {
                targets: channel.getPeers(),
                chaincodePath: chaincodePath,
                chaincodeId: chaincodeName,
                chaincodeVersion: chaincodeVersion
            };
            return client.installChaincode(request);
        })
        .then((result) => {
            console.log(result);
            return result;
        })
        .catch((err) => {
            throw err;
        })
}

var setupChaincodeDeploy = function() {
	process.env.GOPATH = path.join(__dirname, fabricClient.getConfigSetting('CC_SRC_PATH'));
};

exports.intallChaincode = installChaincode;


var ccname = 'mycc';
var ccpath = 'github.com/example_cc';
var ccversion = 'v0.0.1';

installChaincode(ccname, ccpath, ccversion, 'zhangsan31', 'org2')
.then((result) => {
    console.log('call back result');
    console.log(JSON.stringify(result));
})


/* 
 * install chaincode Result,详见installChaincode-result.json文件
 * 
[ [ { version: 0,
      timestamp: null,
      response: [Object],
      payload: <Buffer >,
      endorsement: null },
    { version: 0,
      timestamp: null,
      response: [Object],
      payload: <Buffer >,
      endorsement: null } ],
  { header:
     ByteBuffer {
       buffer: <Buffer 0a 5d 08 03 10 01 1a 0b 08 ab c0 98 d1 05 10 c0 b3 fb 71 2a 40 35 66 37 39 39 32 37 65 65 35 61 31 39 34 64 39 33 34 62 39 36 66 39 64 33 61 36 38 39 ... >,
       offset: 0,
       markedOffset: -1,
       limit: 929,
       littleEndian: false,
       noAssert: false },
    payload:
     ByteBuffer {
       buffer: <Buffer 0a af 0e 0a ac 0e 08 01 12 06 12 04 6c 73 63 63 1a 9f 0e 0a 07 69 6e 73 74 61 6c 6c 0a 93 0e 0a 29 08 01 12 25 0a 15 67 69 74 68 75 62 2e 63 6f 6d 2f ... >,
       offset: 0,
       markedOffset: -1,
       limit: 1842,
       littleEndian: false,
       noAssert: false },
    extension:
     ByteBuffer {
       buffer: <Buffer >,
       offset: 0,
       markedOffset: -1,
       limit: 0,
       littleEndian: false,
       noAssert: false } },
  { channel_header:
     ByteBuffer {
       buffer: <Buffer 08 03 10 01 1a 0b 08 ab c0 98 d1 05 10 c0 b3 fb 71 2a 40 35 66 37 39 39 32 37 65 65 35 61 31 39 34 64 39 33 34 62 39 36 66 39 64 33 61 36 38 39 36 38 ... >,
       offset: 0,
       markedOffset: -1,
       limit: 93,
       littleEndian: false,
       noAssert: false },
    signature_header:
     ByteBuffer {
       buffer: <Buffer 0a a2 06 0a 07 4f 72 67 31 4d 53 50 12 96 06 2d 2d 2d 2d 2d 42 45 47 49 4e 20 43 45 52 54 49 46 49 43 41 54 45 2d 2d 2d 2d 2d 0a 4d 49 49 43 47 54 43 ... >,
       offset: 0,
       markedOffset: -1,
       limit: 831,
       littleEndian: false,
       noAssert: false } } ]
*/

