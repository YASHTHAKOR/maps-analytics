'use strict';

module.exports = (sequelize, DataTypes) => {
    let mapsEtaDetails =   sequelize.define('zone_calibration_config', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        zoneId: DataTypes.INTEGER,
        sourceName: DataTypes.STRING(255),
        sourceLatitude: DataTypes.DOUBLE,
        sourceLongitude: DataTypes.DOUBLE,
        destinationName: DataTypes.STRING(255),
        destinationLatitude: DataTypes.DOUBLE,
        destinationLongitude: DataTypes.DOUBLE,
    }, {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        timestamps: true,
        tableName: 'zone_calibration_config'
    });

    mapsEtaDetails.associate = (model) => {
        mapsEtaDetails.belongsTo(model.zones, {
            onDelete: "CASCADE",
            as: 'zone',
            foreignKey: {
                allowNull: false
            }
        });
    };

    return mapsEtaDetails;
};
