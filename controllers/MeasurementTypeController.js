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

    static async createMeasurementTypeAsync(measurementTypeObj) {
        const returnedObject = await measurementType.create(measurementTypeObj);
        return returnedObject;
    }

}

module.exports = MeasurementTypeController;