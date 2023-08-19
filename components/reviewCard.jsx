import { Box, Flex} from '@chakra-ui/react'
import Image from 'next/image'
import { ChevronUpIcon, ChevronDownIcon} from '@chakra-ui/icons'
import { Cash, Person, PinAngle, Lightbulb, Clock } from 'react-bootstrap-icons';
import { useState } from 'react'
import { Icon, Popup, Grid } from 'semantic-ui-react'

/* TODO: 
    use better star png
*/
export default function ReviewCard({ reviewData }) {

    const [reviewScore, setReviewScore] = useState(4); //useEffect will take the place of this
    const [currScore, setCurrScore] = useState(reviewScore)
    const [userInput, setUserInput] = useState(0)

    const handleLike = (input) => {
        if (userInput == 0) {
            setCurrScore(currScore + input)
            setUserInput(input)
            //make a call incrementing the user's rating
            return
        }
        if (userInput == input) {
            setUserInput(0)
            setCurrScore(reviewScore);
            //make a call deleting the user's rating
            return
        }
        if (input == -1 & userInput == 1) {
            setUserInput(-1)
            setCurrScore(reviewScore -1)
            //make a call changin the user's rating
            return
        }
        if (input == 1 & userInput == -1) {
            setUserInput(1)
            setCurrScore(reviewScore + 1)
            //make a call changin the user's rating
            return
        }

    }
    const reviewFields = ['p', 'cc', 'l', 'pr']
    console.log('reviewData', reviewData)
    return (
        <Box bg='white' className='cardddContainer basicBoxShadow' mt='20px' mb='20px'>
            <Flex align='center' m='15px' p='20px' pt='35px' className='topHalfContainer'>
                <Box ml='5px'>
                    { reviewData.isAnonymous || reviewData.profilePicUrl == '' || reviewData.profilePicUrl == undefined ? (<Image src='/images/empty_profile_pic.png' alt='' height='60' width='60' />):(
                        <Image className='reviewCardProfilePic' src={reviewData.profilePicURL} alt='' height='60' width='60'/>
                    )}
                </Box>

                <Box ml='10px' w='250px' fontSize='30px' fontWeight='700' className='reviewCardUserName'>{(reviewData.isAnonymous ? 'Anonymous' : reviewData.username)}</Box>

                <Flex className='starContainerCard' direction='row' mr='5px'>
                    {Array(parseInt(reviewData.s)).fill(0).map((_, ind) => (
                        <Box key={ind} ml='2px' mr='2px'>
                            <Image src='/images/blue_star.png' alt='' height='40' width='40'/>
                        </Box>
                    ))}
                    {Array(5 - parseInt(reviewData.s)).fill(0).map((_, ind) => (
                        <Box key={ind} ml='2px' mr='2px'>
                            <Image src='/images/empty_star.png' alt='' height='40' width='40'/>
                        </Box>
                    ))}
                </Flex>
            </Flex>

          <Flex direction='row' className='bottomHalfContainer' mt='20px' ml='35px'>
                <Box className='reviewStats' mr='50px'>
                    <Flex className='statsContainer' direction='row'>
                        <Flex direction='column'  fontSize='25px' fontWeight='600' w='10px' mr='12px' ml='35px' className='statLabelContainer'>
                            <Flex direction='row'>
                                <Box ml='10px' mt='5px'><Popup
                                trigger = {<Cash />}
                                content = 'Pay'
                                position = 'top center'
                                ></Popup>
                                </Box>
                                <Box className='statLabel'></Box>
                            </Flex>
                            <Flex mt='7px'>
                                <Box ml='10px' mt='3px'><Popup
                                trigger = {<Person/>}
                                content = 'Culture'
                                position = 'top center'
                                ></Popup></Box>
                                <Box className='statLabel'></Box>    
                            </Flex>

                            <Flex mt='7px'>
                                <Box ml='10px' mt='3px'><Popup
                                trigger = {<PinAngle />}
                                content = 'Location'
                                position = 'top center'
                                ></Popup>
                                    </Box>
                                <Box className='statLabel'></Box>
                            </Flex>
                            
                            <Flex mt='7px'>
                                <Box ml='10px' mt='3px'>
                                    <Popup
                                trigger = {<Lightbulb />}
                                content = 'Productivity'
                                position = 'top center'
                                ></Popup>
                                    </Box>
                                <Box className='statLabel'></Box>
                            </Flex>
                        </Flex>
                        
                        <Box className='reviewCardVL' h='220px'></Box>

                        <Flex direction='column' ml='10px'>
                            {Array(4).fill(0).map((_, ind) => (
                                    <Flex key={ind} direction='row' mt='5px' mb='8px'>
                                        {Array(parseInt(reviewData[reviewFields[ind]])).fill(0).map((_, ind) => (
                                            <Box key={ind} m='5px' ml='5px' mr='5px' h='27px' w='34px' bg='#127399'></Box>
                                        ))}
                                        {Array(5 - parseInt(reviewData[reviewFields[ind]])).fill(0).map((_, ind) => (
                                            <Box key={ind} m='5px'h='27px' mr='5px' ml='5px' w='34px' bg='#D9D9D9'></Box>
                                        ))}
                                    </Flex>
                            ))}
                        </Flex>
                        
                    </Flex>
                </Box>

                <Box className='writtenReviewOuter' w='50%'>
                    <Box className='writtenReviewSection' w='100%' ml='40px'>
                            <Box className='reviewCardHoriz' mb='15px'></Box>
                            <Box className='reviewCardWrittenReview' h='90%'>{reviewData.wr}</Box>
                            <Box className='reviewCardHoriz' mt='15px'></Box>
                    </Box>
                </Box>

                <Box w='40px'></Box>

            </Flex>
            
            <Box ml='25px' mt='40px' fontSize='15px' fontWeight='300' fontStyle='italic'><Clock className='reviewCardClock' />Posted {reviewData.datePosted} </Box>

            <Box className='temp' h='20px'></Box>
        </Box>
    )
}