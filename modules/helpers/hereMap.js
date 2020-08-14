const axios = require('axios');
const moduleConfig = require('./config/module');

const imports = moduleConfig.getImports();
const options = moduleConfig.getOptions();

const getDistanceMatrix = (originArray, destinationArray) => {
    return new Promise(async (resolve, reject) => {
        try {

            let url = 'https://matrix.route.ls.hereapi.com/routing/7.2/calculatematrix.json?mode=fastest;car;traffic:enabled&summaryAttributes=traveltime,distance';

            let waypoints = '';

            originArray.forEach((startPoint,index) => {
                waypoints+= `&start${index}=geo!${startPoint.latitude},${startPoint.longitude}`
            });

            destinationArray.forEach((endPoint,index) => {
                waypoints+= `&destination${index}=geo!${endPoint.latitude},${endPoint.longitude}`
            });

            url = url + waypoints + '&apiKey=' + options.hereMapKey;

            let finalData = {
                rows: []
            };

            axios.get(url)
                .then((response) => {
                    if (response.status === 200) {
                        let matrixDetails = response.data;
                        matrixDetails.response.matrixEntry.forEach((elementDetails) => {
                            let element = {
                                elements: [{
                                    duration_in_traffic: {
                                        value: elementDetails.summary.travelTime
                                    },
                                    duration: {
                                        value: elementDetails.summary.travelTime
                                    },
                                    distance: {
                                        value: elementDetails.summary.distance
                                    },

                                }]
                            };

                            if (finalData.rows[elementDetails.startIndex]) {
                                finalData.rows[elementDetails.startIndex].elements.push(element.elements[0])
                            } else {
                                finalData.rows.push(element);
                            }
                        });

                        return resolve(finalData);
                    }
                });
        } catch(err) {
            reject(err);
        }
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
