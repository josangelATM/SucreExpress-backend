const Package = require('../models/Package')
const PackageRequest = require('../models/PackageRequest')
const User = require('../models/User')
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
        await PackageRequest.deleteOne({tracking:package.tracking})
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
        const package = await Package.findOneAndUpdate({id:packageID},update,{
            new:true
        })
        if(!package){
            throw 'Paquete no existente'
        }
        res.send(package)
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
    let { query,type, userType,customerID,initialDate,finalDate } = req.query;
    let packages = []
    try{
        if(initialDate!='' && initialDate){

            initialDate = new Date(initialDate)
            initialDate.setHours(initialDate.getHours() + 5)
            initialDate = initialDate.toISOString()
            console.log(initialDate)
            if(finalDate!=''){
                finalDate = new Date(finalDate)
                finalDate.setHours(finalDate.getHours() + 5)
                finalDate = finalDate.toISOString()
            }else{
                finalDate = new Date(Date.now())
                finalDate.setHours(finalDate.getHours() + 5)
                finalDate = finalDate.toISOString()
            }
            switch(type){
                case 'ID':
                    packages = await Package.find({id:query,updatedAt:{
                        $gte : initialDate,
                        $lt: finalDate
                    }}).populate('owner')
                break;
                case 'CustomerID':
                    packages = await Package.find({customerID:query,updatedAt:{
                        $gte : initialDate,
                        $lt: finalDate
                    }}).populate('owner') 
                break;
                case 'Tracking':
                    packages = await Package.find({tracking:query,updatedAt:{
                        $gte : initialDate,
                        $lt: finalDate
                    }}).populate('owner')  
                    if(packages.length === 0){
                        if(userType == 'customer'){
                            const filter = {tracking:query}
                            const update = {customerID:customerID,tracking:query,id:generateUniqueId({length:6, useLetters: false})}
                            await PackageRequest.findOneAndUpdate(filter,update,{upsert: true})
                            res.send('Paquete actualmente en tránsito')
                        }
                    }
                break;
                case 'all':
                    packages = await Package.find({updatedAt:{
                        $gte : initialDate,
                        $lt: finalDate
                    }}).populate('owner')  
                break;
    
                case 'referrals':
                    const user = await User.findOne({id:query})
                    const referralsID = user.referrals
                    for(const refID of referralsID){
                        
                        packages.push(await Package.find({customerID:refID,updatedAt:{
                            $gte : initialDate,
                            $lt: finalDate
                        }}).populate('owner'))
                    }
                    packages = packages.flat()
                break;
                default:
                    throw 'Tipo de búsqueda no soportada'
                break;
            }
        }else{
            switch(type){
                case 'ID':
                    packages = await Package.find({id:query}).populate('owner')
                break;
                case 'CustomerID':
                    packages = await Package.find({customerID:query}).populate('owner') 
                break;
                case 'Tracking':
                    packages = await Package.find({tracking:query}).populate('owner')  
                    if(packages.length === 0){
                        if(userType == 'customer'){
                            const filter = {tracking:query}
                            const update = {customerID:customerID,tracking:query,id:generateUniqueId({length:6, useLetters: false})}
                            await PackageRequest.findOneAndUpdate(filter,update,{upsert: true})
                            res.send('Paquete actualmente en tránsito')
                        }
                    }
                break;
                case 'all':
                    packages = await Package.find({}).populate('owner')  
                break;
    
                case 'referrals':
                    const user = await User.findOne({id:query})
                    const referralsID = user.referrals
                    for(const refID of referralsID){
                        
                        packages.push(await Package.find({customerID:refID}).populate('owner'))
                    }
                    packages = packages.flat()
                break;
                default:
                    throw 'Tipo de búsqueda no soportada'
                break;
            }
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
