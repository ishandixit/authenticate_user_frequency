var express = require('express')
var router = express.Router()
var userModel = require('../model')
var bcrypt = require('bcryptjs')
var passport = require('passport')
var jwt = require('jsonwebtoken')
var secret = require('../../config').secret

router.get('/test', (req, res) => {
    res.json({
        "message": "User Worked"
    })
})
router.post('/user/register', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    userModel.userCredential.findOne({
        "email": req.body.email
    }).then((user) => {
        if (user != undefined) {
            return res.status(200).send({
                "ouputCode": 100,
                "message": "user already exists, please login"
            })
        } else {
            const newUser = new userModel.userCredential({
                "email": req.body.email,
                "name": req.body.name,
                "password": req.body.password
            })
            console.log(req.body)
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) {
                        return res.status(200).send({
                            "ouputCode": 100,
                            "message": "Bcrypt internal error"
                        })
                    } else {
                        newUser.password = hash
                        newUser.save()
                            .then((save) => {
                                if (save != undefined) {
                                    return res.status(200).send({
                                        "ouputCode": 200,
                                        "message": "Successfully created",
                                        "userData": save
                                    })
                                }
                            }).catch((error) => {
                                return res.status(200).send({
                                    "ouputCode": 100,
                                    "message": "error in saving new user data ",
                                    "error": error
                                })
                            })
                    }
                })
            })
        }
    })
})
router.post('/register/event', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    userModel.userModel.findOne({
            "eventName": req.body.eventName ? req.body.eventName : "New Event"
        }).then(userRegisterData => {
            if (userRegisterData == undefined) {
                let userRegisterSave = new userModel.userModel(req.body)
                userRegisterSave.save()
                return res.status(200).send({
                    "outputCode": 200,
                    "message": "You have successfully registered your event"
                })
            } else {
                return res.status(200).send({
                    "outputCode": 101,
                    "message": "This event already registered"
                })
            }
        })
        .catch(error => {
            return res.status(200).send({
                "outputCode": 100,
                "message": "error in registering event ",
                "error": error
            })
        })
})

router.put('/event/update',(req,res)=>{
    userModel.userModel.findOne({
        "_id":req.body.eventId
    }).then(fetch=>{
        if(fetch != undefined){
            for(var i in req.body){
                fetch[i]=req.body[i]
            }
            fetch.save()
            return res.status(200).send({
                "outputCode": 200,
                "message": "Updated successfully ",
                "dataSet":fetch
            })
        }else{
            return res.status(200).send({
                "outputCode": 100,
                "message": "No data found "
            })
        }
    })
})

router.post('/user/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    userModel.userCredential.findOne({
        email: req.body.email
    }).then(user => {
        if (!user) {
            return res.status(404).send({
                "code": 404,
                "message": "user not found"
            })
        } else {
            console.log(user)
            bcrypt.compare(password, user.password).then((isMatch) => {
                if (isMatch) {
                    //user matched
                    const payload = {
                        "id": user._id,
                        name: user.name
                    } //jwt create payload
                    jwt.sign(payload, secret, {
                        expiresIn: 3600
                    }, (err, token) => { //expires in 1 hour
                        if (err) {
                            return res.status(404).send({
                                "code": 404,
                                "message": "error in jwt sign / creating token"
                            })
                        } else {
                            return res.status(200).send({
                                "code": 200,
                                "success": true,
                                "token": "Bearer " + token
                            })
                        }
                    })
                    // return res.status(200).send({
                    //     "code":200,
                    //     "message":"success"
                    // }) 
                } else {
                    return res.status(404).send({
                        "code": 404,
                        "message": "failure in password match"
                    })
                }
            })
        }
    }).catch(error => {
        return res.status(400).send({
            "code": 400,
            "message": "Finding user data internal error"
        })
    })
})

router.get('/private', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    res.json(req.user)
})
module.exports = router;