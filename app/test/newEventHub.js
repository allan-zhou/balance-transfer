var fs = require('fs');
var path = require('path');
var fabricClient = require('fabric-client');
var { clients, caClients, channels, getKeyStoreForOrg } = require('./setupPeerAndOrder');
var networkConfig = fabricClient.getConfigSetting('network-config');

var newEventHubs = function (userOrg) {
    var eventsHubs = [];
    var client = clients[userOrg];

    var peers = networkConfig[userOrg].peers
    return fabricClient.newDefaultKeyValueStore({
        path: getKeyStoreForOrg(networkConfig[userOrg].name)
    }).then((store) => {
        client.setStateStore(store);

        return client.getUserContext('zhangsan31', true).then((user) => {
            // console.log(user.toString());
            for (var key in peers) {
                var data = fs.readFileSync(path.join(__dirname, peers[key]['tls_cacerts']));
                let grpcOpts = {
                    pem: Buffer.from(data).toString(),
                    'ssl-target-name-override': peers[key]['server-hostname']
                };

                var eh = client.newEventHub();
                eh.setPeerAddr(peers[key].events, grpcOpts);

                eventsHubs.push(eh);
            }
            return eventsHubs;
        })
    })
}

module.exports = newEventHubs;

// newEventHubs('org1').then((data) => {
//     console.log(data);
// });


