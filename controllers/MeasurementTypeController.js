const measurementType = require('../models/MeasurementType');

class MeasurementTypeController {

    static async getAllMeasurementTypeAsync () {
        return await measurementType.find({}, {created_at: false});  
    }

}

module.exports = MeasurementTypeController;