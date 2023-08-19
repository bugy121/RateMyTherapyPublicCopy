import { ValidateProps } from '../../../api-lib/constants';
import { findUserByEmail, findUserByUsername, insertUser } from '../../../api-lib/db';
import { auths, validateBody } from '../../../api-lib/middlewares';
import { getMongoDb, getMongoClient } from '../../../api-lib/mongodb';
import { ncOpts } from '../../../api-lib/nc';
import { slugUsername } from '../../../lib/user';
import nc from 'next-connect';
import isEmail from 'validator/lib/isEmail';
import normalizeEmail from 'validator/lib/normalizeEmail';
import jwt from "jsonwebtoken"
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const PRIVATE_KEY ='this should be a secret'

const handler = nc(ncOpts);

//the following shouldb be environment variables
const USER_SERVICES_EMAIL = 'RMTCservices@outlook.com'
const USER_SERVICES_PASSWORD = 'LMY2025!'
const TOKEN_EXPIRE_LIMIT = 30 * 60 * 1000
const SERVER_HOST = process.env.SERVER_HOST

handler.post(
  validateBody({
    type: 'object',
    properties: {
      username: ValidateProps.user.username,
      name: ValidateProps.user.name,
      password: ValidateProps.user.password,
      email: ValidateProps.user.email,
    },
    required: ['username', 'name', 'password', 'email'],
    additionalProperties: false,
  }),
  ...auths,
  async (req, res) => {
    try {
    const client = await getMongoClient() 
    const db =  await client.db('RateMyTherapyCompany')

    let { username, name, email, password } = req.body;
    username = slugUsername(req.body.username);
    email = normalizeEmail(req.body.email);
    if (!isEmail(email)) {
      res
        .status(400)
        .json({ error: { message: 'The email you entered is invalid.' } });
      return;
    }
    if (await findUserByEmail(db, email)) {
      res
        .status(403)
        .json({ error: { message: 'The email has already been used.' } });
      return;
    }
    if (await findUserByUsername(db, username)) {
      res
        .status(403)
        .json({ error: { message: 'The username has already been taken.' } });
      return;
    }
    let companiesReviewed = [];
    let random ="df;ladksjf"
    let dataToPost = {
      email,
      originalPassword: password,
      bio: '',
      name,
      username,
    }
    dataToPost.companiesReviewed = [];
    let user = await insertUser(db, dataToPost);

    user = await db.collection('users').findOne({ email: email})
    let secretKey = (crypto.randomBytes(127)).toString('hex');
    user.emailValidationKey = secretKey;

    await db.collection('users').replaceOne({ email: email}, user)
    sendMail(user)

    console.log('the finalized user object: ', user)

    let payload = {_id: user._id}
    jwt.sign(payload, PRIVATE_KEY, { expiresIn: 604800}, (err, token) => {
      if (err) {
          console.log(err)
          res.json({message: 'could not geneate JWT token'})
          return
      }
      res.json({ token: token, user: req.user })
      return
    })

    req.logIn(user, (err) => {
      if (err) throw err;
      res.status(201).json({
        user,
      });
    });
    } catch(e) {
      console.log(e);
      res.status(400).json({message: "error"})
    }
  }
);


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

export default handler;