var fs = require('fs');
var path = require('path');
var fabricClient = require('fabric-client');
var { clients, caClients, channels, getKeyStoreForOrg } = require('./setupPeerAndOrder');
var { getOrgAdmin } = require('./getOrgAdmin');
var networkConfig = fabricClient.getConfigSetting('network-config');

var createChannel = function (channelName, channelConfigPath, username, userOrg) {
    // console.log(arguments);
    var client = clients[userOrg];
    var channel = channels[userOrg];

    var envelope = fs.readFileSync(path.join(__dirname, channelConfigPath));
    var channelConfig = client.extractChannelConfig(envelope);

    return getOrgAdmin(userOrg).then((admin) => {
        var signature = client.signChannelConfig(channelConfig);
        // console.log(signature);

        var request = {
            name: channelName,
            orderer: channel.getOrderers()[0],
            config: channelConfig,
            signatures: [signature],
            txId: client.newTransactionID()
        };

        // console.log(request);
        // send to orderer
        return client.createChannel(request);
    }).then((response) => {
        // console.log(response);
        if (response && response.status === 'SUCCESS') {
            let response = {
                success: true,
                message: channelName +  '  created Successfully'
            }
            return response;
        }
    }).catch((err) => {
        throw err;
    })
}

module.exports = createChannel;


// var cname = fabricClient.getConfigSetting('channelName');
// var cConfigPath = '../../artifacts/channel/mychannel.tx';
// createChannel(cname, cConfigPath, 'zhangsan31', 'org1').then((response) => {
//     console.log('call back response:' + response);
// });


