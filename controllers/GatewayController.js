const gateway = require ('../models/Gateway');

class GatewayController {
   
    static async createGatewayAsync(gatewayName) {
        const returnedObject = await gateway.create({name: gatewayName});
        console.log('New gateway created: ' + gatewayName);
        return returnedObject;
    }

}

module.exports = GatewayController;