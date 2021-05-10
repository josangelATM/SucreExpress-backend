const User = require('../models/User')
const Code = require('../models/Code')
const MailSender = require('../mails/MailSender')
const generateUniqueId = require('generate-unique-id')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();


const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET 

module.exports.register = async (req,res,next) => {
    const user = new User({...req.body})
    user.status = 'active'
    try{ 
        if(req.body.referredBy){
            const referredUserBy = await User.findOne({id:req.body.referredBy})
            if(!referredUserBy){
            throw '# de casillero no existente.'
            }
            user.referredBy = referredUserBy.id
            await User.register(user, req.body.password)
            referredUserBy.referrals.push(user.id)
            await referredUserBy.save()
        }else{
            await User.register(user, req.body.password)
        }
        MailSender.welcomeEmail(user.email,user.firstName,user.id,user.username,req.body.password)
        res.send('Usuario registrado exitosamente,ya puedes iniciar sesión')

    }catch(err){
        next(err)
    }

    
}

module.exports.activate = async (req,res,next) => {
    const { userID, code } = req.params;
    try {
        const userCode = await Code.findOneAndDelete({code: code}) 
        if(userCode){
            const filter = { email: userCode.email}
            const update = { status: 'active'}
            await User.findOneAndUpdate(filter,update)
            res.send('Activación existosa, ya está listo para usar su cuenta')
        }else{
            throw 'Enlace de activación expirado o no válido'
        }
        
        
    } catch (error) {
        res.status(400)
        next(error)
    }
}

module.exports.sendActivation = async (req,res,next) =>{

}

module.exports.login = async (req,res,next) => {
    const accessToken = jwt.sign({ username: req.user.username}, accessTokenSecret, {
        expiresIn: '1h'
    })

    try {
        if(req.user.status == 'deleted'){
            throw 'Usuario o contraseña incorrecta'
        }
        const hasReferrals = req.user.referrals && req.user.referrals.length > 0 ? true : false
    
        res.send({
            username:req.user.username,
            firstName:req.user.firstName,
            lastName:req.user.lastName,
            id: req.user.id,
            type: req.user.type,
            email:req.user.email,
            phoneNumber:req.user.phoneNumber,
            hasReferrals,
            accessToken
        })
    } catch (err) {
        next(err)
    }
    
}

module.exports.recoverPassword = async (req,res,next) =>{
   
    try{
        const user = await User.findOne({email:req.body.email})
        if(!user){
            throw 'Correo no registrado'
        }
        const code = new Code({
            email: req.body.email,
            code: generateUniqueId({length:10})
        })

        await code.save()
        MailSender.passwordRecover(user.email,`${process.env.CLIENT_URL}/recover/${user.id}/${code.code}`)
        
        res.send('Hemos enviado un correo para que puedas cambiar tu contraseña')
        
    }catch(err){
        next(err)
    }
}

module.exports.resetPassword = async (req,res,next) =>{
    const { userID, code } = req.params;
    const pwd = req.body.newPassword
    try{
        const user = await User.findOne({id:userID})
        const codeValid = await Code.findOneAndDelete({code})
        if(!user){
            throw 'Usuario no encontrado'
        }
        if(!codeValid){
            throw 'Enlace de recuperación expirado o no válido'
        }

        await user.setPassword(pwd)
        await user.save()

        res.status(200).send('Contraseña cambiada con exito')

    }catch(err){
        next(err)
    }
}

module.exports.changePassword = async(req,res,next) =>{
    const {currentPassword,newPassword} = req.body;
    const {userID} = req.params;
    try{
        const user = await User.findOne({id:userID})
        if(!user){
            throw 'Usuario no existente'
        }
        await user.changePassword(currentPassword,newPassword)
        res.send('Contraseña actualizada con éxito')
    }catch(err){
        next(err)
    }
}

module.exports.adminChangePassword = async(req,res,next) =>{
    const {newPassword} = req.body;
    const {userID} = req.params;
    try{
        const user = await User.findOne({id:userID})
        if(!user){
            throw 'Usuario no existente'
        }
        await user.setPassword(newPassword)
        await user.save()
        res.send('Contraseña actualizada con éxito')
    }catch(err){
        next(err)
    }
}

module.exports.editInfo = async (req,res,next) =>{
    const { userID } = req.params;
    try {
    let user = await User.findOne({id:userID})
    if(!user){
        throw 'CustomerID no existente'
    }
    if(user.referredBy!=req.body.referredBy){ //Detect changes on referredBy 
        if(user.referredBy==''){ // None referal to Referal 
            const userRef = await User.findOne({id:req.body.referredBy})
            if(!userRef){
                throw 'CustomerID de referido no existente'
            }
            userRef.referrals.push(user.id)
            await userRef.save()
        }else if(!req.body.referredBy==''){ //Referal to other Referal 
            const newUserRef = await User.findOne({id:req.body.referredBy})
            const oldUserRef = await User.findOne({id:user.referredBy})
            if(!newUserRef && !oldUserRef ){
                throw 'CustomerID de referido no existente'
            }
            newUserRef.referrals.push(user.id)
            oldUserRef.referrals = oldUserRef.referrals.filter(item => item !== user.id)
            await newUserRef.save()
            await oldUserRef.save()
        }else if(req.body.referredBy==''){ //Referal to none referal. 
            const userRef = await User.findOne({id:user.referredBy})
            if(!userRef){
                throw 'CustomerID de referido no existente'
            }
            userRef.referrals = userRef.referrals.filter(item => item != user.id)
            await userRef.save()
        }
    
    }
    
    const update = req.body
    user = await User.findOneAndUpdate({id:userID},update,{new:true})
    res.send(user)
    } catch (error) {
        next(error)
    }
}

module.exports.findUsers = async (req,res,next) =>{
    const {query, type, limit} = req.query
    let querySearch = {}
    querySearch[type] = {'$regex': query,$options:'i'}
    try{
        let users = []
        if(limit){
            if(limit=='all'){
                users = await User.find({})
            }
            else{
                users = await User.find({}).sort({createdAt:-1}).limit(parseInt(limit))
            }
            
        }else{
            users = await User.find(querySearch)
        }
        res.send(users)
    }catch(err){
        next(err)
    }
}

module.exports.getByID = async (req,res,next) => {
    const { userID } = req.params;
    try{
        const user = await User.findOne({id:userID})
        if(!user){
            throw 'Usuario no existente'
        }
        res.send(user)
    }catch(err){
        next(err)
    }
}


module.exports.deleteAccount = async (req,res,next) =>{
    const { userID } = req.params;
    try {
        const user = await User.findOne({id:userID})
        if(!user){
            throw 'Customer ID no existente'
        }
        user.status = 'deleted'
        await user.save()
        res.send('Cuenta cambiada a status: Eliminada')
    } catch (err) {
        next(err)
    }
}

module.exports.reactiveAccount = async(req,res,next) =>{
    const { userID } = req.params;
    try {
        const user = await User.findOne({id:userID})
        if(!user){
            throw 'Customer ID no existente'
        }
        user.status = 'active'
        await user.save()
        res.send('Cuenta cambiada a status: Activa')
    } catch (err) {
        next(err)
    }
}