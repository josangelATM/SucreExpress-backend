const Quotation = require('../models/Quotation')
const User = require('../models/User')
const generateUniqueId = require('generate-unique-id')

module.exports.add = async (req,res,next) => {
    const data = req.body;  
    data.id = generateUniqueId({length:6, useLetters: false})
    const quotation = new Quotation(data)
    const user = await User.findOne({id:req.body.customerID})
    try{        
        if(!user){
            throw 'Código de cliente no válido'
        }
        await quotation.save();
        res.send('Cotización registrada')
    }catch(err){
        next(err)
    }

}

module.exports.search = async (req,res,next) => {
    const { query, type } = req.query;
    let quotation=null
    try {
        switch(type){
            case 'ID':
                quotation = await Quotation.find({id:query})
                break;
            case 'CustomerID':
                quotation = await Quotation.find({customerID:query})
                break;
            default:
                res.send('Parámetro  de búsqueda no válido')
                return;
        }

        res.send(quotation)
    } catch (err) {
        next(err)
    }
}

module.exports.getByID = async (req,res,next) => {
    const { quotationID } = req.params;
    try{
        const quotation = await Quotation.findOne({id:quotationID})
        if(!quotation){
            throw 'Cotización no existente'
        }
        res.send(quotation)
    }catch(err){
        next(err)
    }
    

}

module.exports.update = async (req,res,next) => {
    const update = req.body;
    try{
        const quotation = await Quotation.findOneAndUpdate({id:req.body.id},update)
        if(!quotation){
            throw 'Cotización no encontrada'
        }
        res.send('Cotización actualizada')
    }catch(err){
        next(err)
    }
}

module.exports.delete = async (req,res,next) => {
    const { quotationID } = req.params

    try{
        const quotation = await Quotation.findOneAndDelete({id:quotationID})
        if(!quotation){
            throw 'ID no existente'
        }
        res.send('Cotización eliminada')
    }catch(err){
        next(err)
    }
}

module.exports.get = async (req,res,next) => {
    const { limit, query } = req.query;
    console.log(query);
    if(query){
        return this.search(req,res,next)
    }
    try {
        const quotations = await Quotation.find({}).sort({createdAt:-1}).limit(parseInt(limit))
        res.send(quotations)
    } catch (error) {
        next(error)
    }
}