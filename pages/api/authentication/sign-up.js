import validator from 'validator'
import { getMongoClient, getMongoDb } from "../../../api-lib/mongodb";
import nc from "next-connect";
import isEmail from 'validator/lib/isEmail';
import normalizeEmail from 'validator/lib/normalizeEmail';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const handler = nc();

//should be environment variables
const USER_SERVICES_EMAIL = process.env.USER_SERVICES_EMAIL
const USER_SERVICES_PASSWORD = process.env.USER_SERVICES_PASSWORD
const TOKEN_EXPIRE_LIMIT = process.env.JWT_EXPIRE_LIMIT
const SERVER_HOST = process.env.SERVER_HOST
const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY
const JWT_EXPIRE_LIMIT = process.env.JWT_EXPIRE_LIMIT

handler.post(signup)
async function signup(req, res) {
    try {
        const db =  await getMongoDb()
        
        switch (req.method) {
            case 'POST':
                //setup
                let body;
                if (typeof req.body == 'string') {
                    body = JSON.parse(req.body);
                } else {
                    body = req.body;
                }
                let { email, password, username, name, test} = body;

                
                //email must be an actual email
                if (!isEmail(email)) {
                    res.status(400).json({message: 'not an actual email'})
                    break
                }
                //username and email must be unique
                let sameEmail = await db.collection('users').findOne({ email: email })
                if (sameEmail != null) {
                    res.status(400).json({ message: 'that email is already used by another account'})
                    break
                }
                let sameUsername = await db.collection('users').findOne({ username: username })
                if (sameUsername != null) {
                    res.status(400).json({ message: 'that username is already taken'})
                    break
                }

                password = await bcrypt.hash(password, 10);
                let user = { email, password, username, name }

                //add default fields
                user.email = normalizeEmail(email) //important to normalize email
                user.emailVerified = false
                user.profilePicture = null
                user.bio = ''
                user.companiesAdded = []
                user.locationsAdded = []
                user.companiesReviewed = []

                //email verification
                user.emailValidationKey = (crypto.randomBytes(127)).toString('hex');
                user.emailValidationEmailSent = Date.now()
                
                if (email != "testing_name") { //for testing purposes, come up wtih a better solution later
                    sendMail(user)
                }
                
                let {insertedId} = await db.collection("users").insertOne(user)

                user._id = insertedId.toString();
                res.status(200).json({message: 'Welcome to RateMyTherapyCompany', token: generateJWT(insertedId), user: user},)
                break
            default:
                res.json({message: 'only POST allowed'})
        }
    }
    catch (e) {
        console.log(e)
        res.status(500).json({message: 'server error'})
    }
}

function sendMail(user) {
    const transporter = nodemailer.createTransport({
        service : 'outlook',
        auth : {
            user : USER_SERVICES_EMAIL,
            pass : USER_SERVICES_PASSWORD
        }
    })
  
    const options = {
        from : USER_SERVICES_EMAIL, 
        to: user.email, 
        subject: "Validate Email For RateMyTherapyCompany", 
        html: generateHTML(user),
    }
  
    /*
    return new Promise(function (resolve, reject){
        transporter.sendMail(options, (err, info) => {
           if (err) {
              console.log("error: ", err);
              reject(err);
           } else {
              console.log(`Mail sent successfully!`);
              resolve(info);
           }
        });
     });
    */
    //new code
    
    transporter.sendMail(options, (err, info) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
        } else {
          console.log(`Mail sent successfully!`);
          resolve(info);
        }
    });
    
  }
  
  function generateHTML(user) {
    const URL = `${SERVER_HOST}/validateEmail?email=${user.email}&key=${user.emailValidationKey}`
    return (
        `<html>
            <head>
                <style>
                    .italics {
                        font-style: italic;
                    }
                    #title {
                        margin-bottom: 10px;
                    }
                    #link {
                        margin-bottom: 10px;
                        margin-top: 10px;
                    }
                </style>
            </head>
  
            <body>
                <div id="title">Hi ${user.username}! Welcome to RateMyTherapyCompany</div>
                <div>Please validate the email for your new account at the link below, this will especially be useful in case you need to reset your password later! </div>
                <div id="link"><a href="${URL}">Validate Email</a></div>
                <div class="italics">Do not reply or make inquiries to this email</div>
            </body>
        </html>`
    )
  }

  //same logic as in login, if you change login.js, make sure to reflect changes here as well
  const generateJWT = (userID) => {
    let newToken;
    const payload = { _id: userID}
    return jwt.sign(payload, PRIVATE_KEY, { expiresIn: JWT_EXPIRE_LIMIT})
  }
  
  export default handler;