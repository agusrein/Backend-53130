const passport = require('passport');
const local = require('passport-local');
const userModel = require('../models/user.model.js');
const createHash = require('../utils/hashbcrypt.js').createHash;
const isValidPassword = require('../utils/hashbcrypt.js').isValidPassword;


const LocalStrategy = local.Strategy;

const initializePassport = () =>{
    passport.use("register", new LocalStrategy ({
        passReqToCallback: true,
        usernameField: "email"
    },async (req,username,pass, done) =>{
        const {first_name, last_name,email,age} = req.body;
        try {
            let user = await userModel.findOne({email})
            if(user){
                return done(null,false)
            }
            const newUser = {first_name,last_name,email,age,pass: createHash(pass)}
            return done(null, await userModel.create(newUser))
        } catch (error) {
            return done(error);
        }
    }));
}

passport.use('login', new LocalStrategy({
    usernameField: 'email'
}, async (email,pass,done)=>{
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return done(null,false);
        }
        if(!isValidPassword(pass,user)){
            return done(null,false);
        }
        return done(null,user);
    } catch (error) {
        return done(error)
    }
}))

passport.serializeUser((user,done)=>{
    done(null,user._id);
})
passport.deserializeUser(async(id,done)=>{
    const user = await userModel.findById(id);
    done(null,user);
})

module.exports = initializePassport;