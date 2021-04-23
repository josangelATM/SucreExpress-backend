const mongoose = require('mongoose');
const Quotation = require('../models/quotation')
const User =  require('../models/user')

const dbUrl = process.env.DB_URL



mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const links = [
    'https://amazon.com/dp/B001LF3IBG/?tag=randomicle0c-20',
    'https://amazon.com/dp/B0055FSN0Y/?tag=randomicle0c-20',
    'https://amazon.com/dp/B004UHED0C/?tag=randomicle0c-20',
    'https://amazon.com/dp/B082WXCNSG/?tag=randomicle0c-20',
    'https://amazon.com/dp/B071KGF5NJ/?tag=randomicle0c-20',
    'https://amazon.com/dp/B00SLY9SS2/?tag=randomicle0c-20',
    'https://amazon.com/dp/B004GCJ2CA/?tag=randomicle0c-20',
    'https://amazon.com/dp/B083FR6LCF/?tag=randomicle0c-20',
    'https://amazon.com/dp/B00DY8PXCK/?tag=randomicle0c-20',
    'https://amazon.com/dp/B07B3HLX61/?tag=randomicle0c-20'
]



for(i=0; i<20; i++){
    const linksItems = links[Math.floor(Math.random() * links.length)]
    const messageQuotation = 'Hola, deseo saber el precio de traer estos paquetes.'
    User.random(async function(err, document) {
        try {
            quotation = new Quotation({owner: document.id,emailTo: document.email,message: messageQuotation,links:linksItems})
            await quotation.save()
            } catch (error) {
            console.log(error);
            }
        }); 
}



