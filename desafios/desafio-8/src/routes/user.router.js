const express = require('express');
const router = express.Router();
// const userModel = require('../models/user.model.js');
const passport = require('passport');
// const createHash = require('../utils/hashbcrypt.js').createHash;


// router.post("/register" , async (req,res) =>{
//     const {first_name, last_name, email, pass, age} = req.body;
//     try {
//         const existingUser = await userModel.findOne({email})
//         if(existingUser){
//             return res.status(400).render("register", {message: "El correo ingresado ya se encuentra registrado"})
//         }
//         else{
//             const role = email === 'admincoder@coder.com' ? 'admin' : 'user'
//             await userModel.create({first_name,last_name,email,pass: createHash(pass),age,role})
//             req.session.user = {nombre: first_name, apellido: last_name}
//             req.session.login = true;
//             return res.status(200).render("register", {message:"Usuario Creado Exitosamente", success:true});
//     }
//     } catch (error) {
//         res.status(500).render("register", {message:"Error al crear el ususario"});
//     }
// })

router.post("/register", async (req, res, next) => {
    passport.authenticate("register", async (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).render("register", { message: info.message });
        }
        req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            age: user.age,
            email: user.email
        };
        req.session.login = true;
        res.redirect('/profile');
    })(req, res, next);
});

module.exports = router;