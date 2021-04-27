const { Op, fn, literal } = require('sequelize');
const cron = require('node-cron');
const moment = require('moment-timezone');
const moduleConfig = require('./config/module');
const { groupBy } = require('lodash');

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
            destinationName: location.destinationName,
            route: 'Route' + (index+1),
            date: moment().tz('Europe/Sarajevo').format('YYYY-MM-DD'),
            time: moment().tz('Europe/Sarajevo').format('hh:mm a'),
            zoneId: location.zoneId

        };

    await imports.models.maps_eta_details.create(details);


};


const getAndSaveDetails = async () => {

    const zones = await imports.mainModels.zones.findAll({
        where: {
            calibrationStatus: 1
        },
        raw: true,
        attributes: ['id']
    });
    const routes = await imports.mainModels.zone_calibration_config.findAll({
        where: {
            zoneId: { [Op.in]: zones.map(zone => zone.id) }
        },
        raw: true
    });

    const locations = routes.map(route => ({
        source: [{
            latitude: route.sourceLatitude,
            longitude: route.sourceLongitude
        }],
        destination: [{
            latitude: route.destinationLatitude,
            longitude: route.destinationLongitude
        }],
        sourceName: route.sourceName,
        destinationName: route.destinationName,
        zoneId: route.zoneId
    }));


    for(let i=0 ; i< locations.length; i++) {
        await getDetailsfromHereAndGoogle(locations[i], i);
    }
};

cron.schedule('*/15 * * * *', () => {
    console.log(new Date(), 'running a task every 15 minute');
    getAndSaveDetails();
});

/** calibration for all route by time
* SELECT time,avg((durationHereMaps/60)/(durationGoogleMaps/60))as duration_index
* FROM maps_eta_details
* group by time
* */

const updateCalibrationValues = async () => {
    try {
        const zones = await imports.mainModels.zones.findAll({
            where: {
                calibrationStatus: 1
            },
            raw: true,
            attributes: ['id']
        });
        const zoneCalibrations = await imports.mongoModels.zone_calibrations.find({
            zoneId: { $in: zones.map(zone => zone.id) }
        }).exec();
        const calibratedValues = await imports.models.maps_eta_details.findAll({
            where: {
                zoneId: { [Op.in]: zones.map(zone => zone.id) }
            },
            attributes: [
                'time',
                [
                    fn('avg', literal('((`durationHereMaps`/60)/(`durationGoogleMaps`/60))')),
                    'adjustment'
                ],
                'zoneId'
            ],
            group: ['zoneId', 'time'],
            raw: true
        });
        const newCalibrations = groupBy(calibratedValues, 'zoneId');
        const existingZones = zoneCalibrations.map(zc => zc.zoneId);
        await Promise.all(Object.entries(newCalibrations).map(([key, value]) => {
            const calibration = {};

            value.forEach((val) => {
                const timeString = moment(val, 'hh:mm a').format('hh:mm:00 A');
                calibration[timeString] = val.adjustment;
            });
            if (!Object.keys(calibration).length) {
                return Promise.resolve();
            }
            if (existingZones.indexOf(key) === -1) {
                return imports.mongoModels.zone_calibrations.create({
                    zoneId: key,
                    calibration
                });
            }

            return imports.mongoModels.zone_calibrations.update({
                calibration
            }, {
                zoneId: key
            });
        }));
    } catch (e) {
        console.log('Calibration Update Error: ', e);
    }
}

cron.schedule('00 00,12 * * *', () => {
    console.log(new Date(), 'running a task every 12 hours');
    updateCalibrationValues();
});


module.exports = {};
