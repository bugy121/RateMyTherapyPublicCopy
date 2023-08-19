import { Box, Flex } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import Image from 'next/image'
import FadeIn from 'react-fade-in/lib/FadeIn'
import CardCarousel from '../components/carousel'
import { AnimationOnScroll } from 'react-animation-on-scroll';
import Link from 'next/link'
/* pls use this instead of regular css lmao*/
import styles from '../styles/contact.module.css'
import {EnvelopeAtFill, Instagram, Twitter, Facebook, Linkedin} from 'react-bootstrap-icons';
export default function contact() {

    return(
        <Box bg='#152f46' h='100vh'>
            <Box h='40px'></Box>
            <Box h='90px' align='center' fontSize='50px' color='white' fontWeight='800' className='ContactTitle' >Contact Us</Box>
            <Flex justify='center'>
                <Box className={styles.contactDescription} alignSelf='center' textAlign='center' fontSize='20px' w='50%' mb='50px' color='white' fontWeight='600'>Don’t hesitate to reach out with the at the contacts below. For business inquiries, account issues, or general bugs, please contact us by email.</Box>
            </Flex>
            <Flex mt='10px' className={styles.largeContact} justify='center'>
                <Flex align-items='center' direction='column' > 
                    <Box h='55px' fontSize='20px' mb='30px' color='white' fontWeight='800'><EnvelopeAtFill fontSize = '60px' className={styles.contactIcon}/><a className={styles.link} href='mailto:RateMyTherapyCompany@gmail.com'>RateMyTherapyCompany@gmail.com</a> </Box>
                    <Box h='55px' fontSize='20px' mb='30px' color='white' fontWeight='800'><Facebook fontSize = '60px' className={styles.contactIcon}/> <Link className={styles.link} target='_blank' href='https://www.facebook.com/profile.php?id=100063649414989' style={{textDecoration: 'none', "margin-right": '5px'}}>Rate My Therapy Company</Link></Box>
                    <Box h='55px' fontSize='20px' mb='30px' color='white' fontWeight='800'><Instagram fontSize = '60px' className={styles.contactIcon}/> <Link className={styles.link} target='_blank' href='https://instagram.com/ratemytherapycompany?igshid=YjNmNGQ3MDY=' style={{textDecoration: 'none'}}>@RateMyTherapyCompany</Link></Box>
                    <Box h='55px' fontSize='20px' mb='30px' color='white' fontWeight='800'><Twitter fontSize = '60px' className={styles.contactIcon}/> <Link className={styles.link} target='_blank' href='https://twitter.com/RateMyTherapy' style={{textDecoration: 'none'}}>@RateMyTherapy</Link></Box>
                    <Box h='55px' fontSize='20px' mb='30px' color='white' fontWeight='800'><Linkedin fontSize = '60px' className={styles.contactIcon}/> <Link className={styles.link} target='_blank' href='https://www.linkedin.com/company/rate-my-therapy-company/' style={{textDecoration: 'none'}}>Rate My Therapy Company</Link></Box>
                </Flex>
            </Flex>

            <Box mt='0px' className={styles.mobileContact}>
                <Flex justify='center'>
                    <Box fontSize='65px' color='white' ><a  className={styles.contactIcon} href='mailto:RateMyTherapyCompany@gmail.com'><EnvelopeAtFill /></a></Box>
                    <Box ml='30px' mr='30px' fontSize='65px' color='white' ><a className={styles.contactIcon} rel='noreferrer' target='_blank' href='https://www.facebook.com/profile.php?id=100063649414989'><Facebook /></a></Box>
                    <Box fontSize='65px' color='white' ><a className={styles.contactIcon} rel='noreferrer' target='_blank' href='https://instagram.com/ratemytherapycompany?igshid=YjNmNGQ3MDY='><Instagram /></a></Box>
                </Flex>
                <Flex justify='center' >
                    <Box fontSize='65px' color='white' ><a className={styles.contactIcon} rel='noreferrer' target='_blank' href='https://twitter.com/RateMyTherapy'><Twitter /></a></Box>
                    <Box w='30px'></Box>
                    <Box fontSize='65px' color='white' ><a className={styles.contactIcon} rel='noreferrer' target='_blank' href='https://www.linkedin.com/company/rate-my-therapy-company/'><Linkedin /></a></Box>
                </Flex>
            </Box>
        </Box>
    )
}