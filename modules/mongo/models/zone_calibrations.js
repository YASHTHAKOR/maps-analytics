const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let zoneCalibrationModel = new Schema({
    zoneId: {
        type: Number,
        required: true,
        unique: true
    },
    calibration: {
        type: Object,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('zone_calibration', zoneCalibrationModel);