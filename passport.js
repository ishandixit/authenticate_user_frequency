var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var mongoose = require('mongoose')
var userModel = require('./user/model')
var secretOrKey = require('./config').secret

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = secretOrKey;

module.exports= (passport)=>{
    passport.use(new JwtStrategy(opts, (jwt_payload,done)=>{
        console.log(jwt_payload)
        userModel.userCredential.findOne({
            "name":jwt_payload.name
        }).then(data=>{
            if(data){
                return done(null,data)
            }else{
                return done(null,false)
            }
        })
    }))
}