var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    maintenance: {
        type:Boolean
    }
});

var Maintenance = mongoose.model('Maintenance', Schema);

module.exports = Maintenance;