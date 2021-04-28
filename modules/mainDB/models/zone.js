"use strict";

module.exports = (sequelize, DataTypes) => {
  var Zone = sequelize.define("zones", {
    name: DataTypes.STRING,
    countryId: DataTypes.INTEGER,
    parentzoneId: DataTypes.INTEGER,
    lymoPaidTripsFare: DataTypes.INTEGER,
    lymoPaidTripsCount: DataTypes.INTEGER,
    lymoTopDriverPaidTripsCount:  DataTypes.INTEGER,
    type: {
      type: DataTypes.ENUM('city', 'state', 'country')
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    calibrationStatus: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    createdAt   : 'created_at',
    updatedAt   : 'updated_at',
    timestamps  : true,
  });

  Zone.associate = (models) => {
    Zone.belongsTo(models.countries, {
      onDelete: "CASCADE",
      as: 'country',
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Zone;
};
