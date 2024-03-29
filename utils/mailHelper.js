import transporter from "../config/transporter.js";
import config from "../config/index.js";

const mailHelper = async(options) => {
    
    const message = {
        from: config.SMTP_MAIL_EMAIL, // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.text, // plain text body
    }

    await transporter.sendMail(message)

}

export default mailHelper