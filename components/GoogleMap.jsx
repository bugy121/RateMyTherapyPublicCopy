import {React, useState, useEffect, useContext} from 'react';
import { GoogleMap, LoadScript, MarkerF, InfoWindowF, InfoWindow, InfoBox } from '@react-google-maps/api';
import { Box, Text, Flex, Spacer} from '@chakra-ui/react'
import { StateContext } from '../pages/_app';
import { Popover } from 'antd';
import Image from 'next/image'

/* tutorial:
    https://medium.com/@allynak/how-to-use-google-map-api-in-react-app-edb59f64ac9d

   Style Documentation:
   https://react-google-maps-api-docs.netlify.app/

   Fixing the centering issue:
   https://stackoverflow.com/questions/68425883/how-can-i-get-the-current-map-center-coordinates-using-getcenter-in-react-googl
*/


function GMap({height, width, setEvent, setActiveBoxData}){
  
  let { state, setState } = useContext(StateContext)
  const [mapref, setMapRef] = useState(null);
  const [center, setCenter] = useState(null);

  const onMarkerClick = (key, e) => {
    console.log('marker clicked')
    console.log(e)
    state.clickedOnCompany = key;
    setState(JSON.parse(JSON.stringify(state)));
  }
  const handleOnLoad = map => {
    setMapRef(map);
  };

  const handleCenterChanged = () => {
    if (mapref) {
      const newCenter = mapref.getCenter();
      state.mapCenter = newCenter
    }
  };
  
  let defaultCenter = {
    lat: 37.872024, lng: -122.260079
  }

  const setEventAndId = (pinData, e) => {
    setActiveBoxData(pinData)
    setEvent(e)
    if (mapref) {
        setCenter(mapref.getCenter())
    }
    console.log('x: ', e.pixel.x, ' y: ', e.pixel.y)
    console.log(e)

  }

  const mapStyles = {        
    height: height,
    width: width
    };
  const pixelOffset = {
    h: 0,
    height: -1,
    width: -16,
    j: 0,
  }
  const infoBoxOptions = { closeBoxURL: '', enableEventPropagation: true, alignBottom: true, pixelOffset: pixelOffset };
  const content = (comp) => (
    <Box>{comp.companyName}</Box>
  )
  const onLoad = infoBox => {
    //console.log('infoBox: ', infoBox)
  };
  return (
    
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={state.mapZoom}
        center={state.mapCenter || defaultCenter}
        onClick={(e)=>(console.log('mouse lat/lng: ', e.latLng.lat(), e.latLng.lng(), e))}
        onLoad={handleOnLoad}
        onCenterChanged={handleCenterChanged}
      >

        {state.searchOptions.filteredCompanies.map((comp, compInd) => (
          comp.locations.map((location, locInd) => {
            return (<Box key={`${compInd} ${locInd}`} companyindex={compInd} locationindex={locInd}>
              <InfoBox className='infoBox' onLoad={onLoad} position={location.geoLocation} options={infoBoxOptions}>
                <div>
                  <Popover content={content(comp)} >
                    <Image className='googleMapPin' src='/images/pin.png' height='41' width='30'  alt='' onClick={(e) => onMarkerClick(compInd, e)}/>
                  </Popover>
                </div>
              </InfoBox>
            </Box>)
          })
        ))}
      </GoogleMap>
    
  )      
}

export default GMap