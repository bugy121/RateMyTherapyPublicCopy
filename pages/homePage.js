import styles from  '../styles/newHome.module.css'
import { Box, Flex } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import Image from 'next/image'
import FadeIn from 'react-fade-in/lib/FadeIn'
import CardCarousel from '../components/carousel'
import { AnimationOnScroll } from 'react-animation-on-scroll';
import Link from 'next/link'

export default function NewHome() {
    return (
        <Box className={styles.homePageOuter} bg='#152f46'>
            <Box>
                <Box className={styles.topSpacer} h='100px'></Box>
                <FadeIn delay='150' transitionDuration='700'>
                    {/*<Box h='250px' w='870px' margin='auto' className={styles.imageContainer}>
                        <Image className={styles.logo} src='/images/logo.png' alt='logo.png' layout='fill' />
                    </Box> */}

                    <Box align='center' >
                        <Image src='/images/logo_mini.png' height='139' width='203' alt=''/>
                        <Box className={styles.mainTitle} color='#f0e7bb' fontSize='65px' mb='0px' mt='-20px' pt='0px' fontWeight='700'>Rate My Therapy Company</Box>
                        <Box className={styles.mainTitle2} color='white' mt='-5px' fontSize='30px'fontWeight='500'>Honest reviews from allied healthcare workers</Box>
                    </Box>

                    <Flex mt='20px' justify='center'><Box className={`${styles.getStarted} ${styles['shrink-on-hover']}`}><Link className={styles.getStartedLink} href='/sign-up'>Get Started</Link></Box></Flex>
                </FadeIn>

                <FadeIn delay='300' transitionDuration='700'>
                    <Flex mb='-25px' className={styles.therapyImagesContainer} direction='row' justify='center'>
                        
                        <Box h='250px' w='250px' margin='auto' className={styles.imageContainer}>
                            <Image className={styles.logo} src='/images/therapy1.png' alt='logo.png' layout='fill' />
                        </Box>
                        
                        <Box w='550px'></Box>

                        <Box h='250px' w='380px' margin='auto' className={`${styles.imageContainer} ${styles.bottomTherapyPic}`}>
                            <Image className={styles.logo} src='/images/therapy2.webp' alt='logo.png' layout='fill' />
                        </Box>  
                    </Flex>
                </FadeIn>

                <FadeIn delay='500' transition='500'>
                    <Box align='center' fontSize='30px' className={styles.moreLabel}>More</Box>
                    <Box align='center'>
                        <ChevronDownIcon color='#f0e7bb' fontSize='40px' mt='0'/>
                    </Box>
                </FadeIn>  
            </Box>
            <Box h='100px'></Box>
            
            {<Box className={styles.bottomHalf}>
                <Flex direction='row' justify='start' mt='20px'>
                    <Flex color='white' ml='50px' direction='column' className={styles.moreInfo}>
                        <AnimationOnScroll animateIn='animate__bounceInLeft' animateOut='animate__bounceOutLeft' duration={0.8}>
                            <Box fontSize='50px' className={styles.title1}>What is RMTC?</Box>
                        </AnimationOnScroll>

                        <AnimationOnScroll animateIn='animate__fadeIn' animateOut='animate__fadeOut' duration={1.5}>
                        <Box mt='10px' w='75%' fontSize='20px' className={styles.descr1}>Rate My Therapy Company is the number one website for speech therapists, occupational therapists, physical therapists, and assistants to rate and review therapy companies.</Box>
                            </AnimationOnScroll>
                        <Box h='35px'></Box>

                        <AnimationOnScroll animateIn="animate__bounceInLeft" animateOut='animate__bounceOutLeft' duration={0.8}>
                            <Box fontSize='50px' className={styles.title1}>More Companies!</Box>
                        </AnimationOnScroll>

                        <AnimationOnScroll animateIn='animate__fadeIn' animateOut='animate__fadeOut' duration={1.5}>
                            <Box mt='10px' w='75%' fontSize='20px'>We are a growing community. If you don&apos;t see your company we make it easy to add it using the link above.</Box>
                        </AnimationOnScroll>
                    </Flex>

                    <AnimationOnScroll animateIn='animate__bounceInRight' animateOut='animate__bounceOutRight' duration={1} >
                        <Box h='250px' w='445px' mr='50px' className={styles.imageContainer}>
                            <Image className={styles.bottomTherapyPic} src='/images/homePic.png' alt='homePic' layout='fill'/>
                        </Box>
                    </AnimationOnScroll>
                </Flex>
                <Box h='100px'></Box>

                <Box align='center' color='white' fontSize='20px'>Recently Viewed Companies:</Box>
                <Flex mt='15px' w='100vw' color='white' direction='column' align='center'>
                    New Feature Coming Soon!
                </Flex>

                <Box h='100px' pb='0px' mb='0px'></Box>
                
                </Box> }

                {/* Small version of the bottom half of the homepage at <800px screen width*/}
                <Box align='center' color='white' className={styles.bottomHalfSmall}>
                    <AnimationOnScroll animateIn="animate__bounceInLeft" animateOut='animate__bounceOutLeft' duration={0.8}>
                        <Box fontWeight='700' fontSize='35px' w='80%'>What is RMTC?</Box>
                    </AnimationOnScroll>

                    <AnimationOnScroll animateIn="animate__bounceInRight" animateOut='animate__bounceOutRight' duration={0.8}>
                        <Box mt='10px' fontSize='18px' fontWeight='400' width='90%'>Rate My Therapy Company is the number one website for speech therapists, occupational therapists, physical therapists, and assistants to rate and review therapy companies.</Box>
                    </AnimationOnScroll>

                    <AnimationOnScroll animateIn="animate__bounceInLeft" animateOut='animate__bounceOutLeft' duration={0.8}>
                        <Box mt='30px' fontWeight='700' fontSize='35px' w='80%'>More Companies!</Box>
                    </AnimationOnScroll>

                    <AnimationOnScroll animateIn="animate__bounceInRight" animateOut='animate__bounceOutRight' duration={0.8}>
                        <Box  mt='10px' fontSize='18px' fontWeight='400' width='90%'>We are a growing community. If you don&apos;t see your company we make it easy to add it using the link above.</Box>
                    </AnimationOnScroll>
                    
                    <Box mt='80px'>
                        <Box fontWeight='700' fontSize='20px' w='80%'>Recently Viewed Companies:</Box>
                        <Box>New Feature Coming Soon!</Box>
                    </Box>
                </Box>
                <Box h='50vh'></Box>


        </Box>
    )
}