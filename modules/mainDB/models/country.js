"use strict";

module.exports = (sequelize, DataTypes) => {
    var country = sequelize.define("countries", {
        code: DataTypes.STRING,
        currency: DataTypes.STRING,
        timezone: DataTypes.STRING,
        smsCharge: DataTypes.DOUBLE,
        googleMapCharge: DataTypes.DOUBLE,
        paymentServiceCharge: DataTypes.DOUBLE,
        vat: DataTypes.DOUBLE,
        status: DataTypes.INTEGER
    }, {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        timestamps: true,
    });
    country.associate = (models) => {
        country.hasMany(models.zones);
    };
    return country;
};
