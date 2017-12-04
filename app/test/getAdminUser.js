var { clients, caClients, channels, getKeyStoreForOrg } = require('./setupPeerAndOrder');
var fabricClient = require('fabric-client');
var User = require('fabric-client/lib/User.js');
var networkConfig = fabricClient.getConfigSetting('network-config');

var getAdminUser = function (userOrg) {
    var users = fabricClient.getConfigSetting('admins');
    var username = users[0].username;
    var password = users[0].secret;

    var member;
    var client = clients[userOrg];

    return fabricClient.newDefaultKeyValueStore({
        path: getKeyStoreForOrg(networkConfig[userOrg].name)
    }).then((store) => {
        // console.log(store);
        client.setStateStore(store);
        client._userContext = null;

        return client.getUserContext(username, true).then((user) => {
            if (user && !user.isEnrolled()) {
                console.log('user:' + user);
                return user;
            } else {
                var caClient = caClients[userOrg];
                return caClient.enroll({
                    enrollmentID: username,
                    enrollmentSecret: password
                }).then((enrollment) => {
                    member = new User(username);
                    member.setCryptoSuite(client.getCryptoSuite());
                    // console.log('member:' + member);
                    return member.setEnrollment(enrollment.key, enrollment.certificate, networkConfig[userOrg].mspid);
                }).then(() => {
                    return client.setUserContext(member);
                }).then(() => {
                    return member;
                }).catch((err) => {
                    throw err;
                })
            }
        })
    })
}

exports.getAdminUser = getAdminUser;

// 测试
// getAdminUser('org1')
//     .then((user) => {
//         console.log(user.toString());
//     });