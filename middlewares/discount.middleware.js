const Vehicle = require('../models/vehicle.model');

const bookingCheck = async (req, res, next) => {
    
    const { vehicle, startDate, endDate, price, discount } = req.body;


    const vehiclePrice = await Vehicle.findById(vehicle).priceperDay;
    const millisDif = endDate.getTime() - startDate.getTime()
    const days = millisDif / 1000 / 60 / 60 / 24

    if( price !== (vehiclePrice * days)) {
        return res.status(403).json({ message: "El coste de la operación no concuerda con el precio/dia del vehiculo." });
    }

    if (discount === "" || discount === 0) {
        req.body.discount = 0
        next();
    } else if (discount === "PROMO2024") {
        //lo suyo sería tener una coleccion con los datos de la promo...
    req.body.price = price*0.95
    req.body.discount = 5
    next();
    } else if (discount !== "PROMO2024") {
        return res.status(403).json({ message: "La promo no existe." });
    }
};

module.exports = { bookingCheck };