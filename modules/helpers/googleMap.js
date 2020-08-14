const {Client, Status} = require("@googlemaps/google-maps-services-js");

const moduleConfig = require('./config/module');

const imports = moduleConfig.getImports();
const options = moduleConfig.getOptions();

const client = new Client({});


const getDistanceMatrix = (originArray, destinationArray) => {
    let origins = [];
    let destinations = [];
    if (Array.isArray(originArray) && originArray.length) {
        originArray.forEach((origin) => {
            origins.push({lat: parseFloat(origin.latitude), lng: parseFloat(origin.longitude)})
        });
    }
    if (Array.isArray(destinationArray) && destinationArray.length) {
        destinationArray.forEach((destination) => {
            destinations.push({lat: parseFloat(destination.latitude), lng: parseFloat(destination.longitude)})
        });
    }
    return new Promise((resolve, reject) => {
        client.distancematrix({
            params: {
                origins: origins,
                destinations: destinations,
                mode: 'driving',
                departure_time: 'now',
                traffic_model: 'best_guess',
                key: options.googleMapKey
            },
        })
            .then((r) => {
                resolve(r.data);
            })
            .catch((e) => {
                reject(e);
            })
    })
};

// getDistanceMatrix([{
//     latitude: 20.502549,
//     longitude: 73.155319
// }], [{
//     latitude: 20.502549,
//     longitude: 73.155319
// }]);

module.exports = {
    getDistanceMatrix
};
