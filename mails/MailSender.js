
const dotenv = require('dotenv');
const Email = require('email-templates');
dotenv.config();
const path = require('path');



module.exports.welcomeEmail = (sendTo,firstName,lastName,id,username,pwd) =>{

  const email = new Email({
    message: {
      from: process.env.EMAIL
    },
    send: true,
    preview: false,
    transport: {
        host: 'mail.sucrexpresszl.com',
        port: 465,
        secure: true,
        auth: {
          user : process.env.EMAIL,
          pass :  process.env.EMAIL_PWD,
        tls: {
            rejectUnauthorized: false
        }
      }
    }
  });
  
  email
    .send({
      template: path.join(__dirname, 'emails', 'welcome'),
      message: {
        to: sendTo
      },
      locals: {
        firstName,
        lastName,
        id,
        username,
        pwd
      }
    })
    .then(console.log('Correo enviado'))
    .catch(console.error);
}

module.exports.passwordRecover = (sendTo,link) => {
  const email = new Email({
    message: {
      from: process.env.EMAIL
    },
    send: true,
    preview: false,
    transport: {
        host: 'mail.sucrexpresszl.com',
        port: 465,
        secure: true,
        auth: {
          user : process.env.EMAIL,
          pass :  process.env.EMAIL_PWD,
        tls: {
            rejectUnauthorized: false
        }
      }
    }
  });
  
  email
    .send({
      template: path.join(__dirname, 'emails', 'passwordRecover'),
      message: {
        to: sendTo
      },
      locals: {
        link
      }
    })
    .then(console.log('Correo enviado'))
    .catch(console.error);
}
