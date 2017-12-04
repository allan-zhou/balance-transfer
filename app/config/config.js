var util = require('util');
var path = require('path');
var hfc = require('fabric-client');

var file = 'network-config%s.json';

var env = process.env.TARGET_NETWORK;
if (env) {
    file = util.format(file, '-' + env);
}
else {
    file = util.format(file, '')
}

var networkConfigPath = path.join(__dirname, file);
var appConfigPath = path.join(__dirname, 'config.json');

hfc.addConfigFile(networkConfigPath);
hfc.addConfigFile(appConfigPath);
