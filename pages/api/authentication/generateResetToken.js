import { getMongoClient, getMongoDb } from "../../../api-lib/mongodb";
import nc from "next-connect";
const handler = nc();
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const bson = require('bson');

//the following shouldb be environment variables
const USER_SERVICES_EMAIL = process.env.USER_SERVICES_EMAIL
const USER_SERVICES_PASSWORD = process.env.USER_SERVICES_PASSWORD
const TOKEN_EXPIRE_LIMIT = process.env.JWT_EXPIRE_LIMIT
const SERVER_HOST = process.env.SERVER_HOST


handler.post(generateResetToken)


async function generateResetToken(req, res) {
    try {
        switch (req.method) {
            case 'POST':
                const db =  await getMongoDb()

                //check if email exists and get user document
                let { email, test } = req.headers;
                const user = await db.collection('users').findOne({email: email})
                console.log('user', user)
                console.log(email)
                if (user == null) {
                    //important to not inform user if email exists
                    res.status(200).json({ message: 'reset email was sent'})
                    return
                }
                
                if (!user.emailVerified) {
                    res.status(400).json({message: 'Email must be verified before requesting a password reset. Check your inbox for the verification link'})
                    return
                }
                //existing token checks
                if (user.resetToken != undefined) {
                    //do the proper checks
                    let d = user.resetToken.dateCreated
                    if (Date.now() - d < TOKEN_EXPIRE_LIMIT && !user.resetToken.completed) {
                        res.status(400).json({ message: 'a reset email has already been sent. Must wait at most 30 minutes before sending another'})
                        return
                    }
                }
                

                //generate and send the url 
                let secret_key = (crypto.randomBytes(127)).toString('hex');
                let resetURL = `${SERVER_HOST}/resetPassword?key=${secret_key}`

                let newToken = {
                    secretKey: secret_key,
                    dateCreated: Date.now(),
                    completed: false,
                }
                user.resetToken = newToken
                console.log('secret key', secret_key);

                await db.collection('users').replaceOne({_id: bson.ObjectId(user._id)}, user)

                if (test != 'true') {
                    await sendMail(resetURL, user)
                }

                res.status(200).json({message: 'reset password email was sent successfully'})
                return;
            default: 
                res.status(500).json({message: "Only POST allowed"})
        }
    } catch (e) {
        console.error(e)
        res.status(500).json({message: 'Internal Service Error, Please Try Again Later'})
    }

}


function sendMail(URL, user) {
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
        subject: "[Time Sensitive] Reset Password For RateMyTherapyCompany", 
        html: generateHTML(URL, user),
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

function generateHTML(URL, user) {
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
                <div id="title">Hi ${user.username}!</div>
                <div>A request to reset password was recently made to this email</div>
                <div>Click on the Link Below to Reset Email (expires in 30 minutes) </div>
                <div id="link"><a href="${URL}">Reset Password</a></div>

                <div class="italics">Didn't make this request? - Please ignore this email and consider changing your credentials </div>
                <div class="italics">Do not reply or make inquiries to this email</div>
            </body>
        </html>`
    )
}

export default handler