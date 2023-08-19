import { passport } from '../../api-lib/auth';
import { auths } from '../../api-lib/middlewares';
import { ncOpts } from '../../api-lib/nc';
import nc from 'next-connect';
import { getMongoClient, getMongoDb } from "./../../api-lib/mongodb";
import { useToast } from '@chakra-ui/react'
import jwt from "jsonwebtoken"

const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY
const handler = nc(ncOpts);

//handler.use(...auths);

handler.post(passport.authenticate('local'), (req, res) => {
  
  const payload = { _id: req.user._id}

  let newToken;
  jwt.sign(payload, PRIVATE_KEY, { expiresIn: 604800}, (err, token) => {
    if (err) {
        console.log(err)
        res.status(401).json({message: 'could not geneate JWT token'})
    }
    res.json({ token: token, user: req.user })
    return
  })
  let message = { user: req.user,
                  token: newToken
                }

});


handler.delete(async (req, res) => {
  await req.session.destroy();
  res.status(204).end();
});

export default handler;