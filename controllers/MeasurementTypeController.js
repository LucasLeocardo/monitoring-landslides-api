const measurementType = require('../models/MeasurementType');

class MeasurementTypeController {

    static async getAllMeasurementTypeAsync () {
        return await measurementType.find({}, {created_at: false});  
    }

    static async getMeasurementTypeIdAsync (value) {
        return await measurementType.findOne({name: value}).select({
            "_id": 1,
        }).exec();  
    }

}

module.exports = MeasurementTypeController;