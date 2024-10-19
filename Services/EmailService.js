const nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

class EmailService {
    sendmail(recipient, subject, text) {
        var transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: '',
                pass: '',
            },
            tls: {
                rejectUnauthorized: false
            }
        }));

        var mailOptions = {
            from: 'bmahatchi@gmail.com',
            to: recipient,
            subject: subject,
            text: text,
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}

module.exports = new EmailService();
