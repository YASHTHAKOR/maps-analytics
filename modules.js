const path = require('path');

const envPath = path.join(__dirname, '.env');
require('dotenv').config({path: envPath});

module.exports = [{
    packagePath: "./modules/crons",
}, {
    packagePath: "./modules/helpers",
    googleMapKey: process.env.GOOGLE_MAPS_API_KEY,
    hereMapKey: process.env.HERE_MAPS_API_KEY,
}, {
    packagePath: "./modules/mainDB",
    environment: process.env.NODE_ENV
}, {
    packagePath: "./modules/mongo",
    environment: process.env.NODE_ENV
}, {
    packagePath: "./modules/mysql",
    environment: process.env.NODE_ENV
}];
