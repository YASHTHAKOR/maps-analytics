'use strict';

module.exports = (sequelize, DataTypes) => {
    let mapsEtaDetails =   sequelize.define('maps_eta_details', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        sourceName: {
            type:  DataTypes.TEXT
        },
        destinationName: {
            type:  DataTypes.TEXT
        },
        sourceCoordinates: {
            type:  DataTypes.TEXT
        },
        destinationCoordinates: {
            type:  DataTypes.TEXT
        },
        googleResponse: {
            type:  DataTypes.TEXT
        },
        hereMapsResponse: {
            type:  DataTypes.TEXT
        },
        distanceHereMaps: {
            type:  DataTypes.BIGINT
        },
        distanceGoogleMaps: {
            type:  DataTypes.BIGINT
        },
        durationHereMaps: {
            type:  DataTypes.BIGINT
        },
        durationGoogleMaps: {
            type:  DataTypes.BIGINT
        },
        time: {
            type: DataTypes.TEXT
        },
        date: {
            type: DataTypes.DATEONLY
        },
        route: {
            type: DataTypes.TEXT
        }
    }, {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        timestamps: true
    });

    mapsEtaDetails.associate = (model) => {
    };

    return mapsEtaDetails;
};
