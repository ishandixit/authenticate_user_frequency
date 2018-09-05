var mongoose = require('mongoose')
mongoose.Promise = global.Promise;
var timestamps = require('mongoose-timestamp');



var userEventSchema = new mongoose.Schema({
    "eventName": {
        type: String,
        required: true
    },
    "organizerName": {
        type: String,
        required: true
    },
    "dateOfEvent": {
        type: Date
    },
    "time": {
        type: Date,
        default: Date.now()
    },
    "location": {
        type: String
    }
}, {
    timestamps: true
})

var userEventModel = mongoose.model('events', userEventSchema)

var userCredentialSchema = new mongoose.Schema({
    "name": {
        type: String,
        required: true
    },
    "email": {
        type: String,
        required: true
    },
    "password": {
        type: String
    }
   }, {
    timestamps: true
})

var userCredentialModel = mongoose.model('user_credential', userCredentialSchema)
module.exports = {
    "userModel": userEventModel,
    "userCredential":userCredentialModel
}