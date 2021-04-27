const Package = require('../models/Package')
const User = require('../models/User')
const PackageRequest = require('../models/PackageRequest')
const generateUniqueId = require('generate-unique-id')
const nodemailer = require("nodemailer");


module.exports.add = async (req,res,next) => {
    req.body.id = generateUniqueId({length:6, useLetters: false})
    req.body.weight = req.body.weight === "" ? 'TBD' : req.body.weight
    const package = new Package(req.body)
    
    try{        
        const user = await User.findOne({id:req.body.customerID})
        if(!user){
            throw 'Código de cliente no válido'
        }
        await package.save()
        res.send('Paquete registrado')
    }catch(err){
        next(err)
    }

}

module.exports.update = async (req,res,next) => {
    const update = req.body
    if(update.status=='Panamá'){
        update.arrivalDate = Date.now()
    }
    const packageID = req.params.packageID
    try{
        const package = await Package.findOneAndUpdate({id:packageID},update)
        if(!package){
            throw 'Paquete no existente'
        }
        res.send('Paquete actualizado exitosamente')
    }catch(err){
        next(err)
    }
}

module.exports.findById = async (req,res,next) => {
    
    const packageID = req.params.packageID
    try {
        const package = await Package.findOne({id:packageID})
        if(!package){
            throw 'ID de paquete no existente'
        }
        res.send(package)
    } catch (err) {
        next(err)
    }


}

module.exports.findPackage = async (req,res,next) => {
    const { query,type, userType,customerID } = req.query;
    let packages = []
    try{
        switch(type){
            case 'ID':
                packages = await Package.find({id:query}).populate('owner')
            break;
            case 'CustomerID':
                console.log('wtf')
                packages = await Package.find({customerID:query}).populate('owner') 
            break;
            case 'Tracking':
                packages = await Package.find({tracking:query}).populate('owner')  
                if(packages.length === 0){
                    if(userType == 'customer'){
                        const filter = {tracking:query}
                        const update = {customerID:customerID,tracking:query,id:generateUniqueId({length:6, useLetters: false})}
                        const packageRequest = await PackageRequest.findOneAndUpdate(filter,update,{upsert: true})
                        res.send('Paquete actualmente en tránsito')
                    }
                }
            break;
            default:
                throw 'Tipo de búsqueda no soportada'
            break;
        }
        res.send(packages)
    }catch(err){
        next(err)
    }
}

module.exports.deletePackage = async (req,res,next) =>{
    const packageID = req.params.packageID
    try{
        const package = await Package.findOneAndDelete({id:packageID})
        if(!package){
            throw 'Paquete no existente'
        }
        res.send('Paquete eliminado exitosamente')
    }catch(err){
        next(err)
    }
}
