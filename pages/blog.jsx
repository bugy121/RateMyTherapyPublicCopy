import styles from  '../styles/newHome.module.css'
import { Box, Flex } from '@chakra-ui/react'
import Link from 'next/link'
import { Container, Spacer, Wrapper } from '../components/layout';

//todo

export default function blog(){
    return(
        
        <Box bg='#152f46' h='100%'>
            <Wrapper className={styles.root2}>
            <Box h='50px'></Box>
           {/* <Flex ml = '50px' mr = '50px' direction = 'column' justify='start' mt='20px'>*/}
           <Box margin = '' h='100px' align='center' fontSize='50px' mb='10px' color='white' fontWeight='800' className='ContactTitle' >Blog</Box>
                <Box fontSize='30px' className={styles.title1}><Link className='navLink' href='/is-travel-therapy-right-for-you'>Is Travel Therapy Right for You?</Link></Box>
                <Box color = 'white' mt='10px' fontSize='20px'>May 5, 2023 <br></br>Written by Yonas Tekeste, PT, DPT 5/5/23 . Do you feel like you are stuck in a monotonous routine of treating patients day in and day out? Are you struggling to pay off student loans and living paycheck to paycheck? Are you yearning for adventure and the chance to explore new places? If so, then</Box>
                <Box color = 'gray' align='center'><Link className = 'navLink' href = '/is-travel-therapy-right-for-you'>Continue Reading&gt;</Link></Box>
                <Box h = '25px'></Box>
                
                <Box fontSize='30px' className={styles.title1}><Link className='navLink' href='/thrive-as-a-solo-travel-therapist'>Thrive as a Solo Travel Therapist</Link></Box>
                <Box color = 'white' mt='10px' fontSize='20px'>December 11, 2022 <br></br>Solo travel can seem intimidating. It could involve moving every 3 months to new cities, figuring out a new workplace with new coworkers, and not always having a regular support system. How do you make friends when you don’t know a single person in the area and the situation is so temporary? While these concerns</Box>
                <Box color = 'gray' align='center'><Link className = 'navLink' href = '/thrive-as-a-solo-travel-therapist'>Continue Reading&gt;</Link></Box>
                <Box h = '25px'></Box>

                <Box fontSize='30px' className={styles.title1}><Link className='navLink' href='/negotiate-your-worth'>Negotiate your worth</Link></Box>
                <Box color = 'white' mt='10px' fontSize='20px'>August 5, 2022<br></br>Written by Yonas Tekeste, PT, DPT ,CSCS  8/8/22   When it comes to travel therapy contract rates it’s important for any travel healthcare worker to ensure they negotiate when it comes to money and other items that are essential to their contract. We know that discussing these areas can often be a difficult topic, but</Box>
                <Box color = 'gray' align='center'><Link className = 'navLink' href = '/negotiate-your-worth'>Continue Reading&gt;</Link></Box>
                <Box h = '25px'></Box>

                <Box fontSize='30px' className={styles.title1}><Link className='navLink' href='/top-interview-questions-to-ask-during-interview'>Top interview questions to ask during interview</Link></Box>
                <Box color = 'white' mt='10px' fontSize='20px'>June 15, 2022<br></br>Interview the interviewer   We’ve all been there in an interview–when your potential future employer asks, “What questions do you have?” You don’t want to wing this. It’s essential to be as prepared for this question as all the others because you want to ensure this employer is a great fit   You have a</Box>
                <Box color = 'gray' align='center'><Link className = 'navLink' href = '/top-interview-questions-to-ask-during-interview'>Continue Reading&gt;</Link></Box>
                <Box h = '25px'></Box>

                <Box fontSize='30px' className={styles.title1}><Link className='navLink' href='/find-housing-in-3-days-or-less-as-a-traveler'>Find housing in 3 days or less as a traveler</Link></Box>
                <Box color = 'white' mt='10px' fontSize='20px'>March 8, 2022<br></br>A resource I wish would have been available to me beginning as a therapist is “Rate My Therapy Company” Facebook group. This community was created to make it easier for therapists to learn about companies before applying. This group allows therapists to rate companies and provide valuable information on factors such as pay, productivity, and</Box>
                <Box color = 'gray' align='center'><Link className = 'navLink' href = '/find-housing-in-3-days-or-less-as-a-traveler'>Continue Reading&gt;</Link></Box>
                <Box h = '25px'></Box>

                <Box fontSize='30px' className={styles.title1}><Link className='navLink' href='/working-in-hawaii-by-zach-ketcham'>Working in Hawaii by Zach Ketcham</Link></Box>
                <Box color = 'white' mt='10px' fontSize='20px'>December 13, 2021<br></br>A resource I wish would have been available to me beginning as a therapist is “Rate My Therapy Company” Facebook group. This community was created to make it easier for therapists to learn about companies before applying. This group allows therapists to rate companies and provide valuable information on factors such as pay, productivity, and</Box>
                <Box color = 'gray' align='center'><Link className = 'navLink' href = '/working-in-hawaii-by-zach-ketcham'>Continue Reading&gt;</Link></Box>
                <Box h = '25px'></Box>
                
                </Wrapper>
            <Box h = '50px'></Box>
        </Box>
    )
}