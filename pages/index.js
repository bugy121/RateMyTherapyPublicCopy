import HomePage from './homePage'
import clientPromise from '../api-lib/mongodb'
import fetch from 'node-fetch'
//export async function getServerSideProps(context){
//  try{
//      await clientPromise
import { InferGetServerSidePropsType } from 'next'
import Head from 'next/head'

      // `await clientPromise` will use the default database passed in the MONGODB_URI
  // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
  //
  // `const client = await clientPromise`
  // `const db = client.db("myDatabase")`
  //
  // Then you can execute queries against your database like so:
  // db.find({}) or any of the MongoDB Node Driver commands
/*
      return {
          props: {isConnected: true },
      }
  } catch (e) {
      console.error(e)
      return {
          props: { isConnected: false },
      }
  }
}
*/
/*
/////////////////////////
// Uploads an image file
/////////////////////////
const uploadImage = async (imagePath) => {

  // Use the uploaded file's name as the asset's public ID and 
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log(result);
    return result.public_id;
  } catch (error) {
    console.error(error);
  }
};
*/
export default function Home() {
  return (
    <>
      <Head>
        <title>RateMyTherapyCompany</title>
        <meta property="og:title" content="RateMyTherapyCompany" key="title"/>
      </Head>
      <HomePage />
    </>
  )
}