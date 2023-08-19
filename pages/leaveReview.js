import { Box, Flex, Divider} from '@chakra-ui/react'
import { useState, useContext, useEffect } from 'react'
import { StateContext } from './_app'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { Cash, Person, PinAngle, Lightbulb, Star, GeoAltFill } from 'react-bootstrap-icons';
import { toast } from 'react-hot-toast'
import FadeIn from 'react-fade-in/lib/FadeIn'

const initReviewData = {
    wr: '',
    p: 1,
    cc: 1,
    l: 1,
    pr: 1,
    s: 1, //stars and overall are the same thing
}
let companyData = {
    name: "Lorem Ipsum Dolor",
    location: "4315 S. Example St. San Francisco CA 94032",
    website: "www.example.com",
    phone: "(999) 999 9999",
    numReviews: "3",
    reviews: [],
    specialties: ['PT'],
    locations: [
        {
            city: '',
            state: '',
            street: '',
            geolocation: { lat: 0, lng: 0 },
            phoneNumber: '',
            datePosted: '',
            avgStats: {
                avgS: 0,
                avgC: 0,
                avgL: 0, 
                avgP: 0,
                avgPr: 0,
                numReviews: 0,
            },
            reviews: []
        }
    ],
}

export default function LeaveReview () {
    let router = useRouter()
    let idParam = router.query.id
    let [isAnonymous, setAnonymous] = useState(false);
    const [currComp, setComp] = useState(companyData)
    const [reviewData, setReviewData] = useState(initReviewData)
    let { state, setState } = useContext(StateContext)
    console.log('state', state)
    console.log(router.query.ind)
    useEffect(() => {
        if(!router.isReady) return;
        fetch('/api/getCompanyByID', {
            method: 'GET',
            headers: {
                _id: router.query.id
            }
        }).then((response) => response.json()).then(
            (data) => {
                setComp(data.company)
                console.log('comp', currComp)
            }
        )
    }, [router.isReady])

    async function onSubmit() {
        //TODO do this
        let res = await fetch('/api/addReview2', {
            method: 'POST',
            headers: {token: Cookies.get('userToken')},
            body: JSON.stringify({
                reviewData: reviewData,
                companyID: router.query.id,
                isAnonymous: isAnonymous,
                locationIndex: router.query.ind
            })
        })
        let mes = JSON.parse(await res.text())
        if (!res.ok) {
            toast.error(mes.message)
        } else {
            toast.success('successfully Added Review')
            router.replace('/reviewPage')
        }
    }

    const modifyReviewData = (field, rating) => {
        console.log(reviewData)
        reviewData[field] = rating + 1
        setReviewData(JSON.parse(JSON.stringify(reviewData)))
    }
    const modifyWrittenReview = (e) => {
        reviewData.wr = e.target.value
        setReviewData(JSON.parse(JSON.stringify(reviewData)))
    }

    const colorArray = ['blue','blue', 'blue', 'blue', 'blue']
    return (
        <Box bg='#152f46'>
            <Flex className='outerLeaveReviewContainerM' mt='10px' pt='40px' w='100%' direction='row' justify='center' >
                
                
                <Box className='firstPartLeaveReview' mr='50px'>
                    <FadeIn delay='100' transition='700'>
                        <Box className='leaveReviewCompanyName' fontSize='60px' color='white' fontWeight='700'>{currComp.companyName}</Box>
                    </FadeIn>

                    {/* Only present in smaller breakpoint*/}
                    <Flex className='leaveReviewLocationSmall' mt='10px' justify='center'>
                        <Box w='95%' align='center'  padding='15px' borderRadius='8px' color='white' fontSize='18px' bg='#c33b54' fontWeight='700'>Viewing {(currComp.locations[router.query.ind] == undefined ? '': currComp.locations[router.query.ind].city)}, {(currComp.locations[router.query.ind] == undefined ? '': currComp.locations[router.query.ind].state)} Location <GeoAltFill className='geoAltFill' /> </Box>
                    </Flex>
                    
                    <FadeIn delay='200' transition='700'>
                        <Box className='writeReviewM basicBoxShadow' bg='white'  h='400px' mt='20px' p='20'>
                            <textarea rows='0' cols='0' placeholder='Write Review Here' onInput={modifyWrittenReview}>
                            </textarea>
                        </Box>
                    </FadeIn>


                    <FadeIn delay='300' transition='700'>
                        <Flex className='anonymousCheckBoxOuterContainer' mt='20'>
                            <Box className='basicBoxShadow postReviewButtonM' p='13px' pl='20px' pr='20px' color='white' fontWeight='700' bg='#C33C54' fontSize='18px' borderRadius='8px' onClick={onSubmit}>Post Review</Box>
                            <Flex ml='14px'  bg='#00aae4' borderRadius='8px' p='13px' pl='20px' pr='15px'>
                                <Box color='white' fontSize='18px' fontWeight='700' mr='20px'>Anonymous:</Box>
                                <Box mt='-2px'>
                                <label className='checkBoxContainer2'>
                                    <input className='styledCheckBox2' type='checkbox' onChange={(e) => (setAnonymous(e.target.checked))} />
                                    <span className='styledCheckmark2'></span>
                                </label>
                                </Box>
                            </Flex>
                        </Flex>
                    </FadeIn>
                    
                </Box>

                <Box mt='27px' w='550px' className='reviewStatsOuterContainerM'>

                    {/* only present in large breakpoint*/}
                    <FadeIn delay='300' transition='700'>
                        <Flex className='leaveReviewLocationLarge' ml='15px' justify='center'>
                            <Box w='95%' align='center'  padding='15px' borderRadius='8px' color='white' fontSize='18px' bg='#c33b54' fontWeight='700'>Viewing {(currComp.locations[router.query.ind] == undefined ? '': currComp.locations[router.query.ind].city)}, {(currComp.locations[router.query.ind] == undefined ? '': currComp.locations[router.query.ind].state)} Location <GeoAltFill className='geoAltFill' /> </Box>
                        </Flex>
                    </FadeIn>

                    <FadeIn delay='100' transition='100'>
                    <Box className='leaveReviewHorizLineM' align='center' ml='15px'mt='25px'><Box h='1px' w='95%' bg='white'></Box></Box>
                    <Box mt='4px' mb='4px' align='center' color='white' fontSize='25px' fontWeight='700'>Review Stats</Box>
                    <Box className='leaveReviewHorizLineM' align='center' ml='15px'><Box h='1px' w='95%' bg='white'></Box></Box>
                    <Flex justify='center'>
                            <Box mt='30px' mr='-10px' fontSize='22px' fontWeight='700' className='titlesContainerM' w='170px'>
                                <Flex>
                                    <Box ml='15px'><Cash color='white' size='30' /></Box>
                                    <Box className='statReviewLabelM' color='white'>Pay</Box>
                                </Flex>
                                <Flex mt='37px'>
                                    <Box ml='9px'><Person color='white' size='30' /></Box>
                                    <Box className='statReviewLabelM' mt='2px' color='white' >Culture</Box>
                                </Flex>
                                <Flex mt='37px'>
                                    <Box ml='8px'><PinAngle color='white' size='30' /></Box>
                                    <Box className='statReviewLabelM' color='white' >Location</Box>
                                </Flex>
                                <Flex mt='37px'>
                                    <Box ml='5px'><Lightbulb color='white' size='30' /></Box>
                                    <Box className='statReviewLabelM' color='white'>Prod</Box>
                                </Flex>
                                <Flex mt='37px'>
                                    <Box ml='8px'><Star color='white' size='30' /></Box>
                                    <Box className='statReviewLabelM' color='white'>Stars</Box>
                                </Flex>
                            </Box>
                        <Box ml='20px' className='reviewInfoM'>      
                            {(['p', 'cc', 'l', 'pr', 's']).map( (field,j,i) => (
                                    <>
                                    <Flex mt='30px' mb='25px' >
                                        {Array(reviewData[field]).fill(0).map((_, ind, __) => (
                                            <Box key={ind} className='boxRatingM basicBoxShadow' h='35px' w='50px' bg={'#4197e8'} m='3px' ml='5px' mr='5px' onClick={() => (modifyReviewData(field, ind))}></Box>
                                        ))}
                                        {Array(5 - reviewData[field]).fill(0).map((_, ind, __) => (
                                            <Box key={ind} className='boxRatingM basicBoxShadow' h='35px' w='50px' bg='white' m='3px' ml='5px' mr='5px' onClick={() => (modifyReviewData(field, ind + reviewData[field]))}></Box>
                                        ))}
                                    </Flex>
                                    </>
                            ))}
                        </Box>
 
                    </Flex>
                    </FadeIn>

                    <Flex className='alternatePostButtonM' justify='center' direction='column'>
                        <Box w='95%' h='1px' bg='white'></Box>
                        <Flex justify='center'>
                            <Box mb='20px' className='basicBoxShadow' w='145px' p='13px' pl='20px' pr='20px' color='white' fontWeight='700' bg='#C33C54' fontSize='18px' borderRadius='8px' mt='20' onClick={onSubmit}>Post Review</Box>
                        </Flex>
                        <Box w='95%' h='1px' bg='white'></Box>
                    </Flex>
                </Box>




            </Flex>

            <Box className='spacer' h='300px'></Box>
        </Box>
    )
}