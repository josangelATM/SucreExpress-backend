const Bill = require('../models/Bill')
const User = require('../models/User')
const nodemailer = require("nodemailer");
const {Storage} = require('@google-cloud/storage');
const storage = new Storage({keyFilename:'./key.json'});


module.exports.add = async (req,res,next) =>{
    const { id, customerID } = req.body;
    const billFile = req.files.bill;
    try {
        const user = await User.findOne({id:customerID})
        if(!user){
            throw 'Código de cliente no válido'
        }
        await storage.bucket('billsucre').upload(billFile.tempFilePath,{destination: billFile.name,})
        const bill = new Bill({id,customerID,billLink:`https://storage.googleapis.com/billsucre/${billFile.name}`,billFileName:billFile.name})
        await bill.save()
        res.send('Factura guardada')
    } catch (err) {
        next(err)
    }
}


module.exports.find = async (req,res,next) => {
    const {query, type, limit} = req.query
    console.log(query);
    console.log(type);
    let querySearch = {}
    querySearch[type] = {'$regex': query,$options:'i'}
    try{
        let bills = []
        if(limit){
            bills = await Bill.find({}).sort({createdAt:-1}).limit(parseInt(limit))
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