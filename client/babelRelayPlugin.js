const getBabelRelayPlugin = require('babel-relay-plugin');
const schemaData = require('../server/data/schema.json').data;
module.exports =  getBabelRelayPlugin(schemaData);
