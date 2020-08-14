module.exports = (options, imports, register) => {
    const moduleConfig = require('./config/module');

    moduleConfig.setOptions(options);
    moduleConfig.setImports(imports);

    const cron = require('./cron');



    register(null, {

    })

};
