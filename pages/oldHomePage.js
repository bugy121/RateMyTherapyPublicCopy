import NavBar from '../components/navBar'
import { Box, Text, Flex, Center } from '@chakra-ui/react'
import CompanyCard from '../components/companyCard'
import Image from 'next/image'
import CardCarousel from '../components/carousel'
import SignupPopup from '../components/signupPopup'
import { ChevronDownIcon } from '@chakra-ui/icons'
import pic from '../public/images/homePic.png'
import { useEffect } from 'react'
import Cookies from 'js-cookie'
export default function HomePage() {
  useEffect(() => {
    console.log('cookies', Cookies.get())
  })
    return ( 
      <>
        <div className='scrollSnap'>
          <Box className='scrollSection section1'>
            <Box className='elipse1'></Box>
            <Flex direction='column' w='45%' mt='5%' ml='32px'>
              <Box className='medBold' fontSize='20' mb='-7px'>Welcome To</Box>
              <Box className='homeTitle' fontSize='48px' mt='7px' mb='40'>RateMyTherapyCompany</Box>
              <Box mt='10px' mb='10px' className='medBold' w='50%' fontSize='20px'>Honest Reviews From Allied Healthcare Workers</Box>
              <Box mt='15px' className='getStartedButton medBold'>
                Get Started
              </Box>
              <Box className='medBold homePageQuote' mt='10vh' mb='-10px' w='50%'fontSize='20px'>&quot;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim.&quot; </Box>
              <Box width='60%' mt='7vh' align='center'>
                <Box className='medBold' fontSize='25px' mb='-10px' mt='8vh' pb='0'>More</Box>
                <ChevronDownIcon fontSize='35px' mt='0'/>
              </Box>
            </Flex>
          
          </Box>

          <Box className='scrollSection section2'>
            <Image className='therapyPic' width='450' height='250' src='/images/homePic.png' alt='jj'/>
            <Box className='elipse2'></Box>
            <Flex direction='column' width='50%' m='40px' mt='12vh'>
              <Box className='bold1' mb='10px' fontSize='30px'>What Is RateMyTherapyCompany?</Box>
              <Box width='75%' className='bold2' fontSize='19px'>Rate My Therapy Company is the number one website for speech therapists, occupational therapists, physical therapists, and assistants to rate and review therapy companies.</Box>

              <Box className='bold1' fontSize='30px' mt='20px'>Can&apos;t Find Your Company?</Box>
              <Box className='bold2' fontSize='19px'>You can add your company on under the Reviews Section!</Box>
            </Flex>
            
            <Box fontSize='20px' m='15px' mt='12vh' align='center'>Recently Viewed Companies</Box>
            <Flex w='100vw' direction='column' align='center'>
                <Box h='10vh'>
                  <CardCarousel />
                </Box>
              </Flex>
          </Box>

        </div>
      </>
    )
}