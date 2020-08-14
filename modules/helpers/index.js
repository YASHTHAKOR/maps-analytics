module.exports = (options, imports, register) => {
    const moduleConfig = require('./config/module');

    moduleConfig.setOptions(options);
    moduleConfig.setImports(imports);


    const hereMap = require('./hereMap');
    const googleMap = require('./googleMap');

    register(null, {
        hereMap,
        googleMap
    })

};
