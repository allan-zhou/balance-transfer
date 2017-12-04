var hfc = require('fabric-client');
var config = require('../config/config');

var networkConfig = hfc.getConfigSetting('network-config');
console.log(networkConfig);

var order = hfc.getConfigSetting('order');

var port = hfc.getConfigSetting('port');
console.log(port);
