const passport = require('passport');
const local = require('passport-local');
const userModel = require('../models/user.model.js');
const github = require('passport-github2');
const { createHash, isValidPassword } = require('../utils/hashbcrypt.js');
const config = require('./config.js')


const LocalStrategy = local.Strategy;

const initializePassport = () =>{
    passport.use("register", new LocalStrategy ({
        passReqToCallback: true,
        usernameField: "email",
        passwordField: "pass"
    },async (req,username,pass, done) =>{
        const {first_name,last_name,email,age} = req.body;
        try {
            let user = await userModel.findOne({email})
            if(user){
                return done(null,false,{message: 'El email ingresado ya se encuentra registrado'})
            }
            const newUser = {first_name,last_name,email,age,pass: createHash(pass)}
            const result = await userModel.create(newUser)
            return done(null, result)
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('login', new LocalStrategy({
        usernameField: 'email',
        passwordField: "pass"
    }, async (email,pass,done)=>{
        try {
            const user = await userModel.findOne({email});
            if(!user){
                return done(null,false,{message: 'El email ingresado no se encuentra registrado'});
            }
            if(!isValidPassword(pass,user)){
                return done(null,false,{message: 'La contraseña ingresada es inválida'});
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
        const user = await userModel.findById({_id:id});
        done(null,user);
    })
    
    passport.use('github', new github({
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken,refreshToken,profile,done)=>{
        try {
            const user = await userModel.findOne({email: profile._json.email})
            if(!user){
                const newUser = { first_name: profile._json.name,last_name:'',age,email:profile._json.email,pass:''}
                const result = userModel.create(newUser);
                return done(null,result)
                }
           else{
            return done(null,user)
           }
        } catch (error) {
            return done(null,error)
        }
    }))

}


module.exports = initializePassport;