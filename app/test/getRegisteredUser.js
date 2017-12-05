var { clients, caClients, channels, getKeyStoreForOrg } = require('./setupPeerAndOrder');
var { getAdminUser } = require('./getAdminUser')
var fabricClient = require('fabric-client');
var networkConfig = fabricClient.getConfigSetting('network-config');
var User = require('fabric-client/lib/User.js');

var getRegisteredUser = function (username, userOrg, isJson) {
    var member;

    var client = clients[userOrg];
    var enrollmentSecret = null;

    return fabricClient.newDefaultKeyValueStore({
        path: getKeyStoreForOrg(networkConfig[userOrg].name)
    }).then((store) => {
        client.setStateStore(store);
        client._userContext = null;

        return client.getUserContext(username, true).then((user) => {
            if (user && user.isEnrolled()) {
                // console.log('user.isEnrolled():' + user);
                return user;
            } else {
                var caClient = caClients[userOrg];
                return getAdminUser(userOrg).then((adminUser) => {
                    member = adminUser;

                    return caClient.register({
                        enrollmentID: username,
                        affiliation: userOrg + '.department1'
                    }, member);
                }).then((secret) => {
                    enrollmentSecret = secret;

                    return caClient.enroll({
                        enrollmentID: username,
                        enrollmentSecret: secret
                    });
                }).then((enrollment) => {
                    // console.log('enrollment:' + enrollment);
                    member = new User(username);
                    member._enrollmentSecret = enrollmentSecret;
                    return member.setEnrollment(enrollment.key, enrollment.certificate, networkConfig[userOrg].mspid);
                }).then(() => {
                    // console.log('\n member:' + member);
                    client.setUserContext(member);
                    return member;
                }).catch((err) => {
                    throw err;
                })
            }
        })
    }).then((user) => {
        // console.log('\n user:' + user);
        if (isJson && isJson === true) {
			var response = {
				success: true,
				secret: user._enrollmentSecret,
				message: username + ' enrolled Successfully',
			};
			return response;
		}
		return user;
    }).catch((err) => {
        console.log(err);
    })
}

exports.getRegisteredUser = getRegisteredUser;

// enrollUser('zhangsan6', 'org1');
// getRegisteredUser('zhangsan31', 'org1', true).then((user) => {
//     console.log('\n callback user:' + JSON.stringify(user));
// }).then(() => {
//     console.log('haha');
// })


