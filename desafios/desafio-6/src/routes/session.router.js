
const express = require('express');
const router = express.Router();
const userModel = require('../models/user.model.js');
const isValidPassword = require('../utils/hashbcrypt.js').isValidPassword;

router.post("/login", async (req, res) =>{
    const {email, pass} = req.body;
    try {
        const user = await userModel.findOne({email})
        if(user){
            if(isValidPassword(pass,user)){
                req.session.login = true;
                req.session.user ={
                    email: user.email,
                    first_name: user.first_name
                }
               return res.redirect("/products");
            }else{
               return res.status(401).render("login", {message: "Contraseña Invalida"})
            }
        }else return res.status(404).render("login", {message: "Email Incorrecto"});
    } catch (error) {
        return response.status(500).send({ message: `Error al generar ingreso:   ${error}` })
    }
})

router.get("/logout", (req,res)=>{
    if(req.session.login){
        req.session.destroy();
    }
    res.redirect("/login");
})

module.exports = router;