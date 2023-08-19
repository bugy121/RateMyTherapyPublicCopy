import { getMongoClient, getMongoDb } from "../../../api-lib/mongodb";
import nc from "next-connect";
import auth from '../../../middleware/auth'
const nodemailer = require("nodemailer");
import bcrypt from 'bcryptjs';
import { useTransform } from "framer-motion";
const crypto = require('crypto');
const bson = require('bson');
const handler = nc();
handler.use(auth);

const USER_SERVICES_EMAIL = process.env.USER_SERVICES_EMAIL
const USER_SERVICES_PASSWORD = process.env.USER_SERVICES_PASSWORD
const SERVER_HOST = process.env.SERVER_HOST

handler.post(resendVerificationEmail)
async function resendVerificationEmail(req, res) {
    try {
        switch (req.method) {
            case 'POST':
                const db =  await getMongoDb()
                
                let { _id } = req.user
                let user = await db.collection('users').findOne({_id: bson.ObjectID(_id)})
                
                if (Date.now() - user.emailValidationEmailSent < process.env.RESEND_VALIDATION_EMAIL_INTERVAL) {
                    res.status(400).json({message: "Verification email was already sent recently please wait to try again"})
                    return
                }
                user.emailValidationKey = (crypto.randomBytes(127)).toString('hex');
                user.emailValidationEmailSent = Date.now()

                db.collection('users').replaceOne({_id: bson.ObjectID(_id)}, user)
                await sendMail(user)

                res.status(200).json({message: 'Email was sent successfully'})
                return


            default: 
                res.status(500).json({message: "Only POST allowed"})
        }
    } catch (e) {
        console.error(e)
        res.status(500).json({message: 'Internal Service Error, Please Try Again Later'})
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
                <div id="title">Verify Email For RateMyTherapyCompany</div>
                <div>Please validate the email for your new account at the link below, this will especially be useful in case you need to reset your password later! </div>
                <div id="link"><a href="${URL}">Validate Email</a></div>
                <div class="italics">Do not reply or make inquiries to this email</div>
            </body>
        </html>`
    )
  }

export default handler