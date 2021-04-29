module.exports = () => {
    const variables = {
        SMTP: {
            EMAIL: process.env.EMAIL,
            HOST: process.env.SMTPHOST,
            USER: process.env.SMTPUSER,
            PASSWORD: process.env.PASSWORD,
            TO_EMAIL: process.env.TO_EMAIL
        }
    };

    return {
        variables
    }
}
