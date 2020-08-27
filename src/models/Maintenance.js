var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    maintenance: {
        type:Boolean
    },
    chatBackup: {
        type: Map,
    },
    college: {
        type:String  
    },
    campus: {
        type:String
    },
});

var Maintenance = mongoose.model('Maintenance', Schema);

module.exports = Maintenance;