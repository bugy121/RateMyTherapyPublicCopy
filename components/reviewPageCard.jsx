import { Box, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { StateContext } from '../pages/_app'
import Image from 'next/image'
import { Button, Dropdown } from 'antd';

let sampleCompanyData = {
    name: "Lorem Ipsum Dolor",
    location: "4315 S. Example St. San Francisco CA 94032",
    website: "www.example.com",
    phone: "(999) 999 9999",
    numReviews: "3",
    avgStars: '3'
}

const avgStars = (company) => {
    let sum = 0;
    for (let i = 0; i < company.locations.length; i++) {
        sum += company.locations[i].avgStats.s
    }
    return sum / company.locations.length
}
const totalReviews = (company) => {
    let sum = 0;
    for (let i = 0; i < company.locations.length; i++) sum += company.locations[i].avgStats.numReviews;
    return sum
}

function ReviewPageCard({k, h, w, bg}) {
    let router = useRouter()
    let { state, setState } = useContext(StateContext)
    if (k == state.searchOptions.filteredCompanies.length) {
        return
    }
    let companyData = state.searchOptions.filteredCompanies[k]

    const renderCityStateButton = () => {
        if (companyData.locations.length == 1) {
            let loc = companyData.locations[0]
            return (
                <Box cursor='pointer' bg='#adadad' borderRadius='5px' p='5px' pt='3px' pb='3px' color='white' mr='7px' fontSize='15' fontWeight='900' className='reviewAddress basicBoxShadow' onClick={(e) => changeMapCenter(e, 0)}>{`${loc.city}, ${loc.state}`}</Box>
            )
        } else {
            const items = [];
            for (let i = 0; i < companyData.locations.length; i++) {
                let loc = companyData.locations[i]
                let label = (<Box onClick={(e) => changeMapCenter(e, i)}>{`${loc.city}, ${loc.state}`}</Box>)
                items.push({key: i, label: label})
            }
            return (
                <Dropdown cursor='pointer' menu={{ items }} placement='bottomLeft'>
                    <Box cursor='pointer' bg='#adadad' borderRadius='5px' p='5px' pt='3px' pb='3px' color='white' mr='7px' fontSize='15' fontWeight='900' className='reviewAddress basicBoxShadow'>
                        Multiple Locations ▼
                    </Box>
                </Dropdown>

            )
        }

    }

    //changes the mapCenter to the location of the index within locations list
    const changeMapCenter = (e, i) => {
        state.mapCenter = companyData.locations[i].geoLocation;
        state.mapZoom = 15;
        setState(JSON.parse(JSON.stringify(state)))
    }

    return (
        <Flex fontSize='17px' className='card coolBoxShadow' pt='15' pb='25' align='left' bg={bg} color='black' direction='row' justify='start'>
            <Box className='outerContainer' ml='30px' mt='7px' w='400px' >
                <Box cursor='pointer' align='left' fontSize='25px' mb='4px' fontWeight='900' className='reviewBoxName' onClick={()=>(router.push(`/review?id=${companyData._id}`))}>{companyData.companyName}</Box>

                <Flex color='white' fontSize='15px' mr='0px' pr='0px'>
                    {companyData.specialties.map((v) => (
                        <Box key={v} bg='#DD403A' className='basicBoxShadow' borderRadius='5px' fontSize='15px' fontWeight='800' p='3px' pl='15px' pr='15px' mr='5px'>{v}</Box>
                    ))}
                </Flex>

                <Flex zIndex='900' mt='10px' mb='5px'>
                    {renderCityStateButton()}
                    <Image width='22' height='30' src='/images/pin.png' alt='pin'/>
                </Flex>
                {/* 
                <Flex fontSize='18px'>
                    <Box className='reviewPageCardButton' color='white' m='5px' ml='0px' p='5px' pl='10px' pr='10px' bg='#fa254c' borderRadius='5' onClick={()=>(router.push(`/leaveReview?id=${companyData._id}`))} >Review</Box>
                    <Box className='reviewPageCardButton' color='white' m='5px' p='5px' pl='10px' pr='10px' bg='#fa254c' borderRadius='5' onClick={()=>(router.push(`/review?id=${companyData._id}`))}>More</Box>
                </Flex>
                */}

                <Flex mt='5px' mb='10px'>
                    {Array(parseInt(avgStars(companyData))).fill(0).map((_, i) => (<Image key={i}className='reviewCardStar' width='30' height='30' alt='star' src='/images/blue_star.png'/>))}
                    {Array(5 - parseInt(avgStars(companyData))).fill(0).map((_, i) => (<Image key={i} className='reviewCardStar' width='30' height='30' alt='star' src='/images/empty_star.png'/>))}
                    <Box className='numReviews basicBoxShadow' w='95px' bg='#0070f3' color='white' borderRadius='9px' p='5px' pl='10px' pr='10px' fontSize='15px' fontWeight='600' mt='3px' ml='10px' >{totalReviews(companyData)} Reviews</Box>
                </Flex>
            </Box>

            <Box mt='13px' ml='28px' mr='45px'>
                <Image className='pic coolBoxShadow' height='150' width='208' src='/images/logo_mini.png' alt=''/>
            </Box>
        </Flex>
    )
}

export default ReviewPageCard