const EmailManager = require('../services/email.js');
const emailManager = new EmailManager;
const generateResetToken = require('../utils/resetTocken.js');
const { createHash, isValidPassword } = require('../utils/hashbcrypt.js');
const userModel= require('../models/user.model.js')

class UserRepository {
    async requestPasswordReset(email){
        try {
            const user = await userModel.findOne({ email })
            if (!user) {
                return {status:false, message:'Usuario no encontrado'}
            }
            const token = generateResetToken();
            user.resetToken = {
                token: token,
                expire: new Date(Date.now() + 3600000)
            }
            await user.save();
            await emailManager.sendEmailPasswordReset(email, user.first_name, token);
            return {status:true , message: 'El token se ha enviado exitosamente'}
        } catch (error) {
            return { status: false, message: 'Error en el servidor' }
        }
    }



    // async requestPasswordReset(req, res) {
    //     const { email } = req.body;
    //     try {
    //         const user = await userModel.findOne({ email })
    //         if (!user) {
    //             return res.status(404).send('Usuario no encontrado')
    //         }
    //         const token = generateResetTocken();
    //         user.resetToken = {
    //             token: token,
    //             expire: new Date(Date.now() + 3600000)
    //         }
    //         await user.save();
    //         await emailManager.sendEmailPasswordReset(email, user.first_name, token);
    //         res.redirect("/")
    //     } catch (error) {
    //         res.status(500).send('Error interno del servidor');

    //     }
    // }

    async resetPassword(email,pass,token) {
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                return {status: false,code:1, message: 'Usuario no encontrado'}
            }
            const resetToken = user.resetToken;
            if (!resetToken || resetToken.token !== token) {
                return {status: false, code: 2, message: 'Código Inválido'}
            }
            if (Date() < resetToken.expire) {
                return {status:false, code:3, message: 'El token ingresado ha Expirado'}
            }
            if (isValidPassword(pass, user)) {
                return  {status:false, code:4, message:'La nueva contraseña no puede ser igual a la anterior'}
            }
            user.pass = createHash(pass);
            user.resetToken = undefined;
            await user.save();
            return {status:true, message: 'Su contraseña ha sido cambiada con éxito'}
        } catch (error) {
            res.status(500).render(resetPassword, { error: 'Error del servidor' })
        }
    }

    // async resetPassword(req, res) {
    //     const { email, pass, token } = req.body;
    //     try {
    //         const user = await userModel.findOne({ email });
    //         if (!user) {
    //             return res.render('ressetpassword', { error: 'Usuario no encontrado' })
    //         }
    //         if (!resetToken || resetToken.token !== token) {
    //             return res.render('changepassword', { error: 'Codigo inválido' })
    //         }
    //         if (Date() < resetToken.expire) {
    //             return res.render('ressetpassword', { error: 'El token ingresado ha Expirado' })
    //         }
    //         if (isValidPassword(pass, user)) {
    //             return res.render('changepassword', { error: 'La nueva contraseña no puede ser igual a la anterior' })
    //         }
    //         user.pass = createHash(pass);
    //         user.resetToken = undefined;
    //         await user.save();
    //         return res.redirect('/login')
    //     } catch (error) {
    //         res.status(500).render(resetPassword, { error: 'Error del servidor' })
    //     }
    // }

    async changePremiumRol(uid) {
        try {
            const user = await userModel.findById(uid);
            if (!user) {
                return { status: false, message: 'Usuario no encontrado' }
            }
            const newRole = user.role === "user" ? "premium" : "user"
            await userModel.findByIdAndUpdate(uid, { role: newRole })
            return { status: true, message: 'Rol Actualizado' }

        } catch (error) {
            return { status: false, message: 'Error en el servidor' }

        }
    }


    // async changePremiumRol(req, res) {
    //     const { uid } = req.params;
    //     try {
    //         const user = await userModel.findById(uid);
    //         if (!user) {
    //             return res.status(404).send('Usuario no encontrado');
    //         }
    //         const newRole = user.role === "user" ? "premium" : "user"
    //         await userModel.findByIdAndUpdate(uid, { role: newRole })
    //         return res.status(200).send('Rol Actualizado')
    //     } catch (error) {
    //         return res.status(500).send('Error en el servidor')

    //     }
    // }

}

module.exports = UserRepository
