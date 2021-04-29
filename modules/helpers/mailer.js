module.exports = (imports, options) => {
    const nodemailer = require('nodemailer');
    const EmailTemplates = require('swig-email-templates');
    const path = require('path');

    const config = require('./config')(imports, options);

    let templateUrl = path.resolve(__dirname, './template/calibration-updates.html');

    let template = new EmailTemplates({
        juice: {
            images: true
        },
    });

    const renderTemplate = (data) => {
        return new Promise((resolve, reject) => {
            template.render(templateUrl, data, function (err, html) {
                if (err) {
                    return reject(err);
                }
                resolve(html);
            });
        });
    };


    let transporter = nodemailer.createTransport({
        host: config.variables.SMTP.HOST,
        port: 587,
        secure: false,
        auth: {
            user: config.variables.SMTP.USER,
            pass: config.variables.SMTP.PASSWORD
        }
    });

    const mailIt = (data) => {
        return new Promise((resolve, reject) => {
            renderTemplate(data)
                .then((html) => {
                    let mailOptions = {
                        from: `"Lymo Cron" ${config.variables.SMTP.EMAIL}`,//config.variables.SMTP.EMAIL, // sender address
                        to: config.variables.SMTP.TO_EMAIL,
                        subject: 'zone eta calibration',
                        html
                    };
                    transporter.sendMail(mailOptions, function (err, info) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(info);
                    });
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                });
        });
    };

    return {
        mailIt,
    };
};
