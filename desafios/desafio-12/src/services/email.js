const nodemailer = require('nodemailer');
class EmailManager {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                user: "agusreinaldi10@gmail.com",
                pass: ""
            }
        })
    }
    async sendEmailPurchase(email,first_name,ticket){
        try {
            const mailOptions = {
                from: "Coder Test <agusreinaldi10@gmail.com>",
                to:email,
                subject: "Confirmación de Compra",
                html: `
                <h3>Confirmación de compra</h3>
                <p>Gracias por tu compra ${first_name}</p>
                <p>El numero de tu orden es: ${ticket}</p>`
            }
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.log('error al enviar el mail')
        }
    }

    async sendEmailPasswordReset(email,first_name,tocken){
        try {
            const mailOptions = {
                from: "Coder Test <agusreinaldi10@gmail.com>",
                to:email,
                subject: "Restablecimiento de contraseña",
                html: `
                <h3>Restablecimiento de contraseña</h3>
                <p>Hola ${first_name} Recuerda que el código es válido por 24hs.</p>
                <p>Tu codigo de restablecimiento: ${tocken}</p>
                <a href="http://localhost:8080/password">Click Aquí para restablecer tu contraseña</a>`
            }
            await this.transporter.sendMail(mailOptions);
            
        } catch (error) {
            console.log('error al enviar el mail restablecimiento')
        }
    }
}



module.exports = EmailManager;