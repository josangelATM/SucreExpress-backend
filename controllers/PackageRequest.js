const PackageRequest = require('../models/PackageRequest')




module.exports.getLimit = async (req,res,next) => {
    let packagesRequest = []
    try{
        packagesRequest = await PackageRequest.find({}).sort({createdAt:1}).limit(parseInt(req.query.limit))
    res.send(packagesRequest)
    }catch(err){
        next(err)
    }
    
}

module.exports.find = async (req,res,next) =>{
    const {query, type, limit } = req.query
    let packagesRequest = []
    try{
        if(limit){
            return this.getLimit(req,res,next)
        }else{
            if(type=='CustomerID'){
                packagesRequest = await PackageRequest.find({customerID:query}).sort({createdAt:1})
            }else if(type=='Tracking'){
                packagesRequest = await PackageRequest.find({tracking:query}).sort({createdAt:1})
            }
        }   
    res.send(packagesRequest)
    }catch(err){
        next(err)
    }
}

module.exports.delete = async (req,res,next) =>{
    const { requestID } = req.params

    try{
        const request = await PackageRequest.findOneAndDelete({id:requestID})
        console.log(request)
        if(!request){
            throw 'Request no existente'
        }
        res.send('Request Eliminado')
    }catch(err){
        next(err)
    }
   
}
