const passport = require('passport');
const local = require('passport-local');
const userModel = require('../models/user.model.js');
const cartModel = require('../models/carts.model.js');
const github = require('passport-github2');
const jwt = require('passport-jwt');
const { createHash, isValidPassword } = require('../utils/hashbcrypt.js');
const configObject = require('../config/config.js');


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
            const newCart = new cartModel();
            newCart.save()
            const role = email === 'admincoder@coder.com' ? 'admin' : 'user'
            const newUser = { first_name, last_name, email, pass: createHash(pass), age, role ,cart: newCart._id}
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
        clientID: configObject.GITHUB_CLIENT_ID,
        clientSecret: configObject.GITHUB_CLIENT_SECRET,
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
        secretOrKey: configObject.JWTKEY
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
        token = req.cookies[configObject.COOKIETOKEN]
    }
    return token;
}


// ------------------------------------------------------------//
const EmailManager = require('../services/email.js');
const emailManager = new EmailManager;
const generateResetTocken = require('../utils/resetTocken.js');

async requestPasswordReset(req,res) {
    const {email} = req.body;
    try {
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send('Usuario no encontrado')
        }
        const token = generateResetTocken();
        user.resetToken = {
            token:token,
            expire: new Date(Date.now()+3600000)
        } 
        await user.save();
        await emailManager.sendEmailPasswordReset(email,user.first_name,token);
        res.redirect("/")
    } catch (error) {
        res.status(500).send('Error interno del servidor');
        
    }
}

async resetPassword(req,res){
    const {email, pass, token} = req.body;
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.render('ressetpassword', {error: 'Usuario no encontrado'})
        }
        if(!resetToken || resetToken.token !== token){
            return res.render('changepassword', {error: 'Codigo inválido'})
        }
        if(Date()<resetToken.expire){
            return res.render('ressetpassword', {error: 'El token ingresado ha Expirado'})
        }
        if(isValidPassword(pass,user)){
            return res.render('changepassword', {error: 'La nueva contraseña no puede ser igual a la anterior'})
        }
        user.pass = createHash(pass);
        user.resetToken = undefined;
        await user.save();
        return res.redirect('/login')
    } catch (error) {
        res.status(500).render(resetPassword, {error: 'Error del servidor'})
    }
}

async changePremiumRol(req,res){
    const {uid} = req.params;
try {
    const user = await userModel.findById(uid);
    if(!user){
        return res.status(404).send('Usuario no encontrado');
    }
    const newRole = user.role === "user" ? "premium" : "user"
    await userModel.findByIdAndUpdate(uid,{role:newRole})
    return res.status(200).send('Rol Actualizado')
} catch (error) {
    return res.status(500).send('Error en el servidor')
    
}}

module.exports = initializePassport;
