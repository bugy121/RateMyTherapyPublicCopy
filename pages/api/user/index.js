import { ValidateProps } from '../../../api-lib/constants';
import { findUserByUsername, updateUserById, findUserById } from '../../../api-lib/db';
import { auths, validateBody } from '../../../api-lib/middlewares';
import auth from '../../../middleware/auth'
import { getMongoDb } from '../../../api-lib/mongodb';
import { ncOpts } from '../../../api-lib/nc';
import { slugUsername } from '../../../lib/user';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import nc from 'next-connect';

const upload = multer({ dest: '/tmp' });
const handler = nc(); 

if (process.env.CLOUDINARY_URL) {
  const {
    hostname: cloud_name,
    username: api_key,
    password: api_secret,
  } = new URL(process.env.CLOUDINARY_URL);

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
  });
}

handler.use(auth);
/*
handler.get(async (req, res) => {
  if (!req.user) return res.json({ user: null });
  return res.json({ user: req.user });
});
*/
handler.patch(
  upload.single('profilePicture'),

  //validate the data to make sure it fits the desired restraints
  
    validateBody({
      type: "object",
      properties: {
        username: { type: "string", minLength: 4, maxLength: 20 },
        name: { type: "string", minLength: 1, maxLength: 50 },
        bio: { type: "string", minLength: 0, maxLength: 160 },
      },
      additionalProperties: true,
    }),

  async (req, res) => {
    if (!req.body) {
      req.status(401).end();
      return;
    }

    const {name,bio} = req.body;

    const db = await getMongoDb();

    const userInfo = await findUserById(db, req.user._id);

    let profilePicture;

    if (req.file) {
      const image = await cloudinary.uploader.upload(req.file.path, {
        width: 512,
        height: 512,
        crop: 'fill',
      });
      profilePicture = image.secure_url;
    }

    let username;
    console.log("user: ", req.user);
    if (req.body.username) {
      username = slugUsername(req.body.username);
      
      if (
        username !== userInfo.username && 
        (await findUserByUsername(db, username))
      ) {
        res
          .status(403)
      .json({ error: { message:'The username has already been taken.'} });
        return;
      }
    }

    const user = await updateUserById(db, req.user._id, {
      ...(username && { username }),
      ...(name && { name }),
      ...(typeof bio === 'string' && { bio }),
      ...(profilePicture && { profilePicture }),
    });

    res.json({ user });
  }
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;