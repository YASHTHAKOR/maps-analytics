
const moduleConfig = require('./config/module');

const imports = moduleConfig.getImports();
const options = moduleConfig.getOptions();

const getDistanceAndDuration = (data) => {


    let distance = data.rows[0].elements[0].distance.value;
    let duration = data.rows[0].elements[0].duration_in_traffic.value;

    return {
        distance,
        duration
    }

};



const getDetailsfromHereAndGoogle = async(source, destination, index) => {
        let hereMapDetails = await imports.hereMap.getDistanceMatrix(source, destination);
        let googleMapDetails = await imports.googleMap.getDistanceMatrix(source, destination);

        const hereMapsDistanceDuration = getDistanceAndDuration(hereMapDetails);
        const googleMapsDistanceDuration = getDistanceAndDuration(googleMapDetails);

        let details = {
            sourceCoordinates: source[0].latitude + ',' + source[0].longitude,
            destinationCoordinates: destination[0].latitude + ',' + destination[0].longitude,
            googleResponse: JSON.stringify(googleMapDetails),
            hereMapsResponse: JSON.stringify(hereMapDetails),
            distanceHereMaps: hereMapsDistanceDuration.distance,
            distanceGoogleMaps: googleMapsDistanceDuration.distance,
            durationHereMaps: hereMapsDistanceDuration.duration,
            durationGoogleMaps: googleMapsDistanceDuration.duration,
            sourceName: 'Route'+ (index + 1),
            destinationName: 'Route'+ (index + 1)
        };

    await imports.models.maps_eta_details.create(details);


};


const getAndSaveDetails = async () => {

    const locations = [{
        source: [{
            latitude: 20.502549,
            longitude: 73.155319
        }],
        destination: [{
            latitude: 20.502549,
            longitude: 73.155319
        }]
    }];


    for(let i=0 ; i< locations.length; i++) {
        await getDetailsfromHereAndGoogle(locations[i].source, locations[i].destination, i);

    }

};

getAndSaveDetails();

module.exports = {};
