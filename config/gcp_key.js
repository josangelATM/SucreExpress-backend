const dotenv = require('dotenv');
dotenv.config();


module.exports.key = {
        "type": process.env.GCP_URL,
        "project_id": process.env.GCP_TYPE,
        "private_key_id": process.env.GCP_PROJECTID,
        "private_key": process.env.GCP_PRIVATE_KEY_ID,
        "client_email": process.env.GCP_CLIENT_EMAIL,
        "client_id": process.env.GCP_CLIENT_ID,
        "auth_uri": process.env.GCP_AUTH_URI,
        "token_uri": process.env.GCP_TOKEN_URI,
        "auth_provider_x509_cert_url": process.env.GCP_AUTH_PROVIDER ,
        "client_x509_cert_url": process.env.GCP_CLIENT_X509
  };