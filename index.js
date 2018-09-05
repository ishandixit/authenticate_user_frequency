console.log("hello world")
var express = require('express')
var app = express()
var mongoose = require('mongoose')
var bodyParser = require('body-parser');
var passport = require('passport');


var port = require('./config').port
var mongodbUri = require('./config').mongoUri
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
    parameterLimit: 50000
}));
//passport middleware
app.use(passport.initialize())
require('./passport')(passport);


mongoose.connect(mongodbUri, {
    // useMongoClient: true,
    useNewUrlParser: true
}).then(data => {
    console.log("db connected successfully",)
})
var db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))


app.use('/', require('./user/controller/user'))





app.listen(port, () => {
    console.log("Your server is listening on port " + port)
})