const Bill = require('../models/Bill')
const User = require('../models/User')
const nodemailer = require("nodemailer");
const {Storage} = require('@google-cloud/storage');
const storage = new Storage({keyFilename:'./key.json'});


module.exports.add = async (req,res,next) =>{

    const { id, customerID,billName } = req.body;
    const billFile = req.files.bill;
    var chars = id.slice(0, id.search(/\d/));
    var billNumber = id.replace(chars, '');
    try {
        const user = await User.findOne({id:customerID})
        if(!user){
            throw 'Código de cliente no válido'
        }
        await storage.bucket('billsucre').upload(billFile.tempFilePath,{destination: billName,})
        const bill = new Bill({id,customerID,billLink:`https://storage.googleapis.com/billsucre/${billName}`,billFileName:billName,billNumber})
        await bill.save()
        res.send('Factura guardada')
    } catch (err) {
        next(err)
    }
}


module.exports.find = async (req,res,next) => {
    const {query, type, limit} = req.query
    let querySearch = {}
    querySearch[type] = {'$regex': query,$options:'i'}
    try{
        let bills = []
        if(limit){
            bills = await Bill.find({}).sort({createdAt:-1}).limit(parseInt(limit))
        }else if(type=='all'){
            bills = await Bill.find({})
        }else{
            bills = await Bill.find(querySearch)
        }
        res.send(bills)
    }catch(err){
        next(err)
    }
}

module.exports.getBillLink = async(req,res,next) =>{
    const {billID} = req.params;

    try {
        const bill = await Bill.findOne({id:billID})
        if(!bill){
            throw 'ID de factura no existente'
        }
        const options = {
            version: 'v4',
            action: 'read',
            expires: Date.now() + 30 * 60 * 1000, // 30 minutes
          };
        const [url] = await storage
                .bucket('billsucre')
                .file(bill.billFileName)
                .getSignedUrl(options)
        console.log(url)
        res.send(url)
    } catch (err) {
        next(err)
    }

    
}

module.exports.getLastID = async(req,res,next) =>{
    try{
        const bill = await Bill.findOne({},{},{sort: {'billNumber':-1}})
        res.send(bill.billNumber.toString())
    }catch(err){
        next(err)
    }
}