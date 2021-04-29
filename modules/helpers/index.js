module.exports = (options, imports, register) => {
    const moduleConfig = require('./config/module');

    moduleConfig.setOptions(options);
    moduleConfig.setImports(imports);


    const hereMap = require('./hereMap');
    const googleMap = require('./googleMap');
    const config = require('./config')(imports, options);
    const mailer = require('./mailer')(imports, options);

    register(null, {
        hereMap,
        googleMap,
        config,
        mailer
    })

};
