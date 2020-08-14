const cron = require('node-cron');
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



const getDetailsfromHereAndGoogle = async(location, index) => {
        let hereMapDetails = await imports.hereMap.getDistanceMatrix(location.source, location.destination);
        let googleMapDetails = await imports.googleMap.getDistanceMatrix(location.source, location.destination);

        const hereMapsDistanceDuration = getDistanceAndDuration(hereMapDetails);
        const googleMapsDistanceDuration = getDistanceAndDuration(googleMapDetails);

        let details = {
            sourceCoordinates: location.source[0].latitude + ',' + location.source[0].longitude,
            destinationCoordinates: location.destination[0].latitude + ',' + location.destination[0].longitude,
            googleResponse: JSON.stringify(googleMapDetails),
            hereMapsResponse: JSON.stringify(hereMapDetails),
            distanceHereMaps: hereMapsDistanceDuration.distance,
            distanceGoogleMaps: googleMapsDistanceDuration.distance,
            durationHereMaps: hereMapsDistanceDuration.duration,
            durationGoogleMaps: googleMapsDistanceDuration.duration,
            sourceName: location.sourceName,
            destinationName: location.destinationName
        };

    await imports.models.maps_eta_details.create(details);


};


const getAndSaveDetails = async () => {

    const locations = [{
        source: [{
            latitude:  46.203964,
            longitude: 6.142820
        }],
        destination: [{
            latitude: 46.191864,
            longitude: 6.152905
        }],
        sourceName: 'Rue François-Diday 3',
        destinationName: 'Avenue de champel 53'
    },{
        source: [{
            latitude:  46.208640,
            longitude: 6.146054
        }],
        destination: [{
            latitude: 46.187741,
            longitude: 6.157964
        }],
        sourceName: 'Rue Pécolat 8',
        destinationName: 'Chemin des Clochettes 8'
    },{
        source: [{
            latitude:  46.193965,
            longitude: 6.139899
        }],
        destination: [{
            latitude: 46.203124,
            longitude: 6.158163
        }],
        sourceName: 'Boulevard du Pont dArve 48',
        destinationName: 'Rue de la Mairie 13'
    },{
        source: [{
            latitude:  46.192127,
            longitude: 6.129181
        }],
        destination: [{
            latitude: 46.210316,
            longitude: 6.144047
        }],
        sourceName: 'Rue Boissonnas 20',
        destinationName: 'Place de Cornavin 20'
    },{
        source: [{
            latitude:  46.202710,
            longitude: 6.159131
        }],
        destination: [{
            latitude: 46.196430,
            longitude: 6.148226
        }],
        sourceName: 'Rue de Montchoisy 4',
        destinationName: 'Boulevard de la Tour 14'
    },{
        source: [{
            latitude:  46.191892,
            longitude: 6.152817
        }],
        destination: [{
            latitude: 46.204915,
            longitude: 6.144662
        }],
        sourceName: 'Avenue de champel 53',
        destinationName: 'Rue du Rhône 11'
    },{
        source: [{
            latitude:  46.194160,
            longitude: 6.155990
        }],
        destination: [{
            latitude: 46.237255,
            longitude: 6.109210
        }],
        sourceName: 'Avenue Alfred-Bertrand',
        destinationName: 'Aiport'
    },{
        source: [{
            latitude:  46.237255,
            longitude: 6.109210
        }],
        destination: [{
            latitude: 46.204839,
            longitude: 6.157726
        }],
        sourceName: 'Aiport',
        destinationName: 'Rue du simplon 7'
    },{
        source: [{
            latitude:  46.203388,
            longitude: 6.149850
        }],
        destination: [{
            latitude: 46.250802,
            longitude: 6.149509
        }],
        sourceName: 'Place longemalle 4',
        destinationName: 'La Réserve Bellevue'
    },{
        source: [{
            latitude:  46.203388,
            longitude: 6.149850
        }],
        destination: [{
            latitude: 46.202170,
            longitude: 6.138210
        }],
        sourceName: 'Place longemalle 4',
        destinationName: 'Rue des Rois 15'
    }];


    for(let i=0 ; i< locations.length; i++) {
        await getDetailsfromHereAndGoogle(locations[i], i);

    }
};

cron.schedule('*/15 * * * *', () => {
    console.log(new Date(), 'running a task every 15 minute');
    getAndSaveDetails();
});


module.exports = {};
