import { Box, Flex, Divider, Text } from '@chakra-ui/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { StateContext } from './_app'
import { useContext, useEffect, useState } from 'react'
import { captureRejectionSymbol } from 'events'
import toast from 'react-hot-toast';
import ReviewCard from '../components/reviewCard'
import { PhoneIcon } from '@chakra-ui/icons'
import { PinFill, Window, Cash, Person, PinAngle, Lightbulb, Funnel , CaretDownFill, XCircle, PlusSquare, List } from 'react-bootstrap-icons';
import { Button, Dropdown, Popover } from 'antd';
import FadeIn from 'react-fade-in/lib/FadeIn'

/* icons: https://icons.getbootstrap.com/ */
/* color palette: https://coolors.co/152f46-c33c54-e2adf2-23c9ff-7cc6fe*/

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
                s: 0,
                cc: 0,
                l: 0, 
                p: 0,
                pr: 0,
                numReviews: 0,
            },
            reviews: []
        }
    ],
}

export default function IndividualReview () {

    let { state, setState } = useContext(StateContext)
    let router = useRouter()
    let [currComp, setCurrComp] = useState(companyData)
    let [locationIndex, setLocationIndex] = useState(0);

    useEffect(() => {
        if(!router.isReady) return;
        fetch('/api/getCompanyByID', {
            method: 'GET',
            headers: {
                _id: router.query.id
            }
        }).then((response) => response.json()).then(
            (data) => {
                //TODO
                setCurrComp(JSON.parse(JSON.stringify(data.company)))
                console.log(currComp)
                console.log(data.company)
            }
        )
    }, [router.isReady])
    let fields = ['p', 'cc', 'l', 'pr']

    const onMoreInfoClick = () => {
        state.companyInfoPopupOpen = !state.companyInfoPopupOpen
        setState(JSON.parse(JSON.stringify(state)));
    }

    const renderLocationName = () => {
        let { city, street } = currComp.locations[locationIndex];
        return `${street} ${city}, ${currComp.locations[locationIndex].state}`
    }
    const renderMoreInfo = () => {
        if (!state.companyInfoPopupOpen) return
        return (
            <Flex className='mainCompanyInfo2' borderRadius='5px' fontSize='20px' w='89vw' h='290px' m='20' p='5px'  direction='column'>
            <Box className='mainCompanyInfo2CloseButton' onClick={() => onMoreInfoClick()}><XCircle /></Box>
            <Box align='center' fontSize='20px' fontWeight='700' mt='15px'>More Info</Box>
            
            <Box margin='auto' mt='0' mb='0' w='85%'><hr className='horizLine'/></Box>

            <Flex fontSize='20px'>
                <Box className='companyInfoItem'>{currComp.locations[locationIndex].phoneNumber == '' ? 'No Phone Available': currComp.locations[locationIndex].phoneNumber}</Box>
                <PhoneIcon fontSize='20px' mr='35px' mt='5px' />
            </Flex>

            <Box margin='auto' mt='0' mb='0' w='85%'><hr className='horizLine'/></Box>
            
            <Flex>
                <Box className='companyInfoItem'>{renderLocationName()}</Box>
                <PinFill className='pinFill' size='28px'/>
            </Flex>

            <Box margin='auto' mt='0' mb='0' w='85%'><hr className='horizLine'/></Box>
            
            <Flex>
                <Box className='companyInfoItem'>{currComp.website == '' ? 'No Website Available': currComp.website}</Box>
                <Window className='windowIcon' size='28px'/>
            </Flex>

            <Box margin='auto' mt='0' mb='0' w='85%'><hr className='horizLine'/></Box>
        </Flex>
        )
    }

    //dropdown for changing between locations
    const items = []
    for (let i = 0; i < currComp.locations.length; i++) {
        let label = (<Box onClick={() => setLocationIndex(i)}>{currComp.locations[i].city}, {currComp.locations[i].state}</Box>)
        items.push({ key: i, label: label})
    }
    



    return (
        <Box className='individualReview' bg='#152f46' mt='0'>

            <Box h='30px'></Box>
            <Box h='1px' w='95%' m='auto' mt='20px' bg='white'></Box>
            <Flex className='outerTitleContainer' pl='30px' pt='20px'>
                <Box color='white' ml='20px'>

                    <FadeIn delay='50' transation='700'>
                    <Flex className='titleContainer'>
                        <Box className='basicBoxShadow reviewImageTop' mr='20px' h='139px' w='203px'><Image src='/images/logo_mini.png' alt='' height='139' width='203'/></Box>
                        <Box>
                            <Box className='reviewCompTitle' w='600px' fontSize='43px' fontWeight='800'>{currComp.companyName}</Box>
                            <Flex className='specialtiesContainer' fontSize='15px' fontWeight='700' >
                                {currComp.specialties.map((val) => (
                                    <Box bg='#C33C54' key={val} p='5px' pl='15px' pr='15px' borderRadius='12px' mr='10px'>{val}</Box>
                                ))}
                            </Flex>
                        </Box>
                    </Flex>
                    </FadeIn>
                    
                    <FadeIn delay='100' transition='700'>
                    {<Flex mt='15px' className='starContainer' direction='row'>
                        <Flex className='starsList'>
                            {Array(Math.ceil(currComp.locations[locationIndex].avgStats.s)).fill(0).map((_, ind) => (<Image className='reviewImage' key={ind} width='60' height='60' alt='' src='/images/blue_star.png'/>))}
                            {Array(5 - Math.ceil(currComp.locations[locationIndex].avgStats.s)).fill(0).map((_, ind) => (<Image key={ind} className='reviewImage' width='60' height='60' alt='' src='/images/empty_star.png'/>))}
                        </Flex>
                        <Box className='numReviewsLabel' mt='17' ml='13' color='white' fontSize='17px' fontWeight='500'>{currComp.locations[locationIndex].avgStats.numReviews} reviews</Box>
                    </Flex>}
                    </FadeIn>
                </Box>
                
                <Box w='20%'></Box>
                {<Flex className='reviewStatsOuterContainer' mt='15px' ml='20px' mr='30px'>
                    <FadeIn delay='150' transition='700'>
                    <Box color='white' className='reviewStatsContainer'>
                        <Flex>
                            <Box ml='10px' fontSize='25px' fontWeight='900' mb='10px'><Cash /></Box>
                            <Box className='statTitle' fontSize='27px' fontWeight='800'>Pay</Box>
                        </Flex>
                        <Flex>
                            <Box ml='10px' fontSize='25px' fontWeight='900' mb='10px'><Person /></Box>
                            <Box className='statTitle' fontSize='27px' fontWeight='800'>Culture</Box>
                        </Flex>
                        <Flex>
                            <Box ml='10px' fontSize='25px' fontWeight='900' mb='10px'><PinAngle /></Box>
                            <Box className='statTitle' fontSize='27px' fontWeight='800'>Location</Box>
                        </Flex>
                        <Flex>
                            <Box ml='10px' fontSize='25px' fontWeight='900' mb='10px'><Lightbulb /></Box>
                            <Box className='statTitle' fontSize='27px' fontWeight='800'>Productivity</Box>
                        </Flex>
                    </Box>
                    </FadeIn>

                    <Flex direction='column' ml='10px'>
                            {Array(4).fill(0).map((_, ind) => (
                                    <Flex key={ind} direction='row' mt='3px' mb='5px'>
                                        {Array(Math.ceil(currComp.locations[locationIndex].avgStats[fields[ind]])).fill(0).map((_, ind) => (
                                            <Box key={ind} m='5px' ml='5px' mr='5px' h='30px' w='40px' bg='#127399'></Box>
                                        ))}
                                        {Array(5 - Math.ceil(currComp.locations[locationIndex].avgStats[fields[ind]])).fill(0).map((_, ind) => (
                                            <Box key={ind} m='5px'h='30px' mr='5px' ml='5px' w='40px' bg='#D9D9D9'></Box>
                                        ))}
                                    </Flex>
                            ))}
                    </Flex>

                </Flex>}
            </Flex>
            <Box h='1px' w='95%' m='auto' mt='20px' bg='white'></Box>
            
            <Box h='15px'></Box>
            

            {/* Flex Container separates morInfo from the rest*/}
            <Flex className='reviewBottomHalfContainer'>

                {/* Container for horizontal bar with buttons and options*/}
                <FadeIn delay='200' transition='700'>
                <Box>
                    {<Flex className='reviewButtonsContainer' bg='#152f46' ml='30px'>
                        <Box cursor='pointer' className='reviewButton writeReviewButton' mr='0px' bg='#C33C54' color='white' fontWeight='700' onClick={() => router.push(`/leaveReview?id=${router.query.id}&ind=${locationIndex}`)}>Review</Box>
                        <Box cursor='pointer'  className='reviewButton shareSaveButtons none750' bg='#23C9FF' color='white' fontWeight='700' onClick={() => toast.success('Save feature coming soon!')}>Save</Box>
                        
                        <Dropdown menu={{ items }}>
                            <Box cursor='pointer' color='white' bg='#0070f3' pt='13px' pl='20px' pr='20px' h='50px' mt='10px' fontWeight='700' borderRadius='8px'>Location: {currComp.locations[locationIndex].city}, {currComp.locations[locationIndex].state} ▼</Box>
                        </Dropdown>
                            
                        <Popover className='none750' content={(<Box>Add A Location To This Company</Box>)}>
                            <Box cursor='pointer' className='plusOuterReview' h='50px' mt='10px' ml='10px' mr='5px' color='white'  bg='#23C9FF' borderRadius='8px' onClick={() => router.push(`/addLocation?id=${router.query.id}`)}><PlusSquare className='reviewPlusSquare' /></Box>
                        </Popover>

                        <Box cursor='pointer' className='moreInfoClickable moreInfoButton reviewButton none750' ml='5px' mr='5px' bg='white' color='black' onClick={() => onMoreInfoClick()}>More Info</Box>
                        
                        <Box ml='5px' cursro='pointer' className='reviewFilterIconOuter none750' bg='#C33C54' color='white' mt='10px' h='50px' p='12px' borderRadius='8px' fontSize='25px' onClick={() => toast.success('filtering comming soon')}><Funnel className='reviewFilterIcon'/></Box>
                    </Flex>}
                    

                    {/* Drop down containing some elements from above for compactness in mobile version*/}
                    <Flex className='reviewButtonsDropdown' justify='center'>
                    <Dropdown menu={{ items: [
                        {key: '1', label: (<Box onClick={() => onMoreInfoClick()}>More Info</Box>)},
                        {key: '2', label: (<Box onClick={() => router.push(`/addLocation?id=${router.query.id}`)}>Add Location</Box>)},
                        {key: '3', label: (<Box onClick={() => toast.success('filtering comming soon')}>Filter</Box>)} 
                        ]}}>
                        <Box bg='white' p='10px' pt='1px' pb='5px' fontSize='30px' borderRadius='7px'><List /></Box>
                    </Dropdown>
                    </Flex>

                    {renderMoreInfo()}

                    <Flex className='reviewList' direction='column' mt='-5px'>
                        {Array(currComp.locations[locationIndex].reviews.length).fill(0).map((_, ind) => (
                            <FadeIn key={ind} delay={250 + ind * 50} transition='700'>
                                <ReviewCard key={ind} reviewData={currComp.locations[locationIndex].reviews[ind]}/>
                            </FadeIn>
                        ))}
                        {(()=>{
                            if(currComp.locations[locationIndex].reviews.length == 0) {
                                return (
                                    <Box className='basicBoxShadow noReviewsYet' w='60vw' mt='20px' borderRadius='7px' h='300px' bg='white'>
                                        <Box>No Reviews Yet</Box>
                                        <Box className='bold1' align='center' fontSize='15px' >
                                            <Box align='center' w='80%'>Click on &apos;write a review&apos; and be the first to review!</Box>
                                        </Box>
                                    </Box>
                                )
                            }
                        })()}
                    </Flex>

                    <Box h='400px'></Box>
                </Box>
                </FadeIn>

                
                <Box className='spacer' w='50px'></Box>

                {/* company info for large screens*/}
                <Flex className='mainCompanyInfo' w='29vw' h='320px' m='20' ml='-20px' p='5px'  direction='column'>
                    <FadeIn delay='250' transition='700'>
                    <Flex direction='column'>
                        <Box align='center' fontSize='30px' fontWeight='700' mt='15px'>More Info</Box>
                        
                        <Box margin='auto' mt='0' mb='0' w='85%'><hr className='horizLine'/></Box>

                        <Flex>
                            <Box className='companyInfoItem'>{currComp.locations[locationIndex].phoneNumber == '' ? 'No Phone Available': currComp.locations[locationIndex].phoneNumber}</Box>
                            <PhoneIcon fontSize='25px' mr='35px' mt='5px' />
                        </Flex>

                        <Box margin='auto' mt='0' mb='0' w='85%'><hr className='horizLine'/></Box>
                        
                        <Flex>
                            <Box className='companyInfoItem'>{renderLocationName()}</Box>
                            <PinFill className='pinFill' size='28px'/>
                        </Flex>

                        <Box margin='auto' mt='0' mb='0' w='85%'><hr className='horizLine'/></Box>
                        
                        <Flex>
                            {Array(1).fill(0).map((_) => {
                                if (currComp.website == "") {
                                    return (<Box key={_} className='companyInfoItem'> No Website Available</Box>)
                                }
                                return (<Box className='companyInfoItem'key={_}><a className='companyInfoLink'  href={currComp.website} rel="noreferrer" target='_blank'>website</a></Box>)
                            })}
                            <Window className='windowIcon' size='28px'/>
                        </Flex>
                        
                        <Box margin='auto' mt='0' mb='5px' w='85%'><hr className='horizLine'/></Box>
                        </Flex>
                        </FadeIn>
                    </Flex>

            </Flex> 


        </Box>
    )
}