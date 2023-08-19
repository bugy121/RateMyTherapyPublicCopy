import { Settings } from '../page-components/settings';
import Head from 'next/head';
import {Box} from '@chakra-ui/react';

//require("dotenv").config({path:__dirname+'../.env.local'});
//const cloudinary = require("cloudinary").v2;
//console.log(cloudinary.config().cloud_name);

const SettingPage = () => {
  return (
    <>
      
        <Head>
          <title>Settings</title>
        </Head>
        <Settings />
    </>
  );
};

export default SettingPage;

