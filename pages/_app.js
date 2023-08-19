import '../styles/MyApp.css';
import '../styles/VerticalScroll.css';
import '../styles/reviewPageCard.css';
import '../styles/homePage.css'
import '../styles/navBar.css'
import '../styles/review.css'
import '../styles/leaveReview.css'
import '../styles/signupPopup.css'
import '../styles/loginPopup.css'
import '../styles/addCompany.css'
import '../styles/reviewPage.css'
import '../styles/reviewCard.css'
import 'animate.css/animate.min.css';
import NavBar from '../components/navBar';
import HomePage from './homePage'
import ReviewPage from './reviewPage'
import 'bootstrap/dist/css/bootstrap.min.css';
import { createContext, useState, useEffect } from 'react'
import { Box } from '@chakra-ui/react'
import { LoadScript } from '@react-google-maps/api';
import Cookies from 'js-cookie';
import Head from 'next/head';
import dotenv from 'dotenv'
import {Analytics} from '@vercel/analytics/react'

const StateContext = createContext()

let defaultCenter = {
  lat: 37.872024, lng: -122.260079
}

let stateInit = {
    user: {},
    signUpOpen: false,
    loginOpen: false,
    reviewPageCompanies: [],
    leaveReview: '',
    searchOptions: {
      search: '',
      location: '',
      preciseLocation: {
        lat: '',
        lng: ''
      },
      filteredCompanies: []
    },
    leaveReviewIndex: 0, //the index of the location that the user will review
    mapCenter: defaultCenter,
    isLoadingCompanies: true, //Used only within reviewPage.js and verticalScroll.js. used when loading companies for first time
    isSearchingCompanies: false, //used within reviewPage.js. use whenever searching companies after first render
    mapZoom: 5, //default mapZoom
    mapWidth: '40vw',
    buttonsOpen: false,
    clickedOnCompany: -1,
    flterPopupOpen: false,
    mapPopupOpen: false,
    companyInfoPopupOpen: false,
    
}
/* Managing State:
  state and setState are accessible to all components/pages via StateContext.
  add any useful state data here using setState or just add it to stateInit
*/
  

import '../assets/base.css';

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

async function getLoggedIn(state, setState) {
  console.log(Cookies.get('userToken'))
  let res = await fetch('/api/authentication/get-logged-in', {
      method: 'GET',
      headers: {token: Cookies.get('userToken')},
  })
  let body = await res.json()
  if (res.ok) {
    state.user = body.user
    state.buttonsOpen = true;
  } else {
    state.user = null;
    state.buttonsOpen = false;
  }
  setState(JSON.parse(JSON.stringify(state)))
}

export default function MyApp({ Component, pageProps }) {
  
  // Create a Cloudinary instance and set your cloud name.
  /*
   const cld = new Cloudinary({
    cloud: {
      cloudName: 'profile'
    }
  })
  */

  let [state, setState] = useState(stateInit)
  useEffect(()=>{
    getLoggedIn(state, setState)
  }, [])
  return (
        <StateContext.Provider value={{state: state, setState: setState}}>
          <Head>
            <title>RateMyTherapyCompany</title>
            <meta property="og:title" content="RateMyTherapyCompany" key="title"/>
            <link rel="icon" href='/images/logo_mini_square.png'></link>
          </Head>
          <div className='firstDiv'>
            <NavBar />
            <Component {...pageProps} />
            <Analytics/>
            <Toaster />
          </div>
        </StateContext.Provider>
  );
}

export {StateContext}