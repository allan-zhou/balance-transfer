var fs = require('fs');
var path = require('path');
var { clients, caClients, channels, getKeyStoreForOrg } = require('./setupPeerAndOrder');
var fabricClient = require('fabric-client');
var networkConfig = fabricClient.getConfigSetting('network-config');

var getOrgAdmin = function (userOrg) {
    var admin = networkConfig[userOrg].admin;

    var keyPath = path.join(__dirname, admin.key);
    var keyPEM = Buffer.from(readAllFiles(keyPath)[0]).toString();
    var certPath = path.join(__dirname, admin.cert);
    var certPEM = Buffer.from(readAllFiles(certPath)[0]).toString();

    var client = clients[userOrg];

    return fabricClient.newDefaultKeyValueStore({
        path: getKeyStoreForOrg(networkConfig[userOrg].name)
    }).then((store) => {
        client.setStateStore(store);

        return client.createUser({
            username: 'peer' + userOrg + 'Admin',
            mspid: networkConfig[userOrg].mspid,
            cryptoContent: {
                privateKeyPEM: keyPEM,
                signedCertPEM: certPEM
            }
        });
    })
}

function readAllFiles(dir) {
    var files = fs.readdirSync(dir);
    var cert = [];

    files.forEach((fileName) => {
        var filePath = path.join(dir, fileName);
        var data = fs.readFileSync(filePath);
        cert.push(data);
    })
    // console.log(cert);
    return cert;
}

exports.getOrgAdmin = getOrgAdmin;

// getOrgAdmin('org1').then((data) => {
//     console.log(data.toString());
// });