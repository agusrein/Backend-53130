const passport = require('passport');
const local = require('passport-local');
const userModel = require('../models/user.model.js');
const github = require('passport-github2');
const jwt = require('passport-jwt')
const { createHash, isValidPassword } = require('../utils/hashbcrypt.js');
const config = require('./config.js')


const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const initializePassport = () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email",
        passwordField: "pass"
    }, async (req, username, pass, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
            let user = await userModel.findOne({ email })
            if (user) {
                return done(null, false, { message: 'El email ingresado ya se encuentra registrado' })
            }
            const newUser = { first_name, last_name, email, age, pass: createHash(pass) }
            const result = await userModel.create(newUser)
            return done(null, result)
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('login', new LocalStrategy({
        usernameField: 'email',
        passwordField: "pass"
    }, async (email, pass, done) => {
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'El email ingresado no se encuentra registrado' });
            }
            if (!isValidPassword(pass, user)) {
                return done(null, false, { message: 'La contraseña ingresada es inválida' });
            }
            return done(null, user);
        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById({ _id: id });
        done(null, user);
    })

    passport.use('github', new github({
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await userModel.findOne({ email: profile._json.email })
            if (!user) {
                const newUser = { first_name: profile._json.name, last_name: '', age, email: profile._json.email, pass: '' }
                const result = userModel.create(newUser);
                return done(null, result)
            }
            else {
                return done(null, user)
            }
        } catch (error) {
            return done(null, error)
        }
    }))

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: 'coderkey'
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))

}

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['coderCookieToken']
    }
    return token;
}

const jwtAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }
        req.user = user;
        next();
    })(req, res, next);
};
module.exports = {initializePassport, jwtAuth};
