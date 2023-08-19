import {useState} from 'react'
import Carousel from 'react-bootstrap/Carousel';
import { Box, Flex } from '@chakra-ui/react'
import CompanyCard from './companyCard';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

function CardCarousel() {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };

    const nextStyle = {
        position:'absolute',
        right:'-15px',
    }
    const prevStyle = {
        position:'absolute',
        left:'-15px'
    }

    const nextIcon = (<ChevronRightIcon color='white' h='80' w='50' style={nextStyle} />)
    const prevIcon = (<ChevronLeftIcon color='white' h='80' w='50' style={prevStyle} />)

    return (
        
        <Carousel indicators={false} interval={null} nextIcon={nextIcon} prevIcon={prevIcon} activeIndex={index} onSelect={handleSelect}>

            <Carousel.Item>
                <Flex justify='space-between'>
                    <CompanyCard ml='50' mr='8'/>
                    <CompanyCard ml='8' mr='8'/>
                    <CompanyCard ml='8' mr='8'/>
                    <CompanyCard ml='8' mr='8'/>
                    <CompanyCard ml='8' mr='50'/>
                </Flex>
                <br />
            </Carousel.Item>
            
            <Carousel.Item>
                <Flex justify='space-between'>
                    <CompanyCard ml='42' mr='8'/>
                    <CompanyCard ml='8' mr='8'/>
                    <CompanyCard ml='8' mr='8'/>
                    <CompanyCard ml='8' mr='8'/>
                    <CompanyCard ml='8' mr='42'/>
                </Flex>
                <br />
            </Carousel.Item>
            
            <Carousel.Item>
                <Flex justify='space-between'>
                    <CompanyCard ml='42' mr='8'/>
                    <CompanyCard ml='8' mr='8'/>
                    <CompanyCard ml='8' mr='8'/>
                    <CompanyCard ml='8' mr='8'/>
                    <CompanyCard ml='8' mr='42'/>
                </Flex>
                <br />
            </Carousel.Item>
        </Carousel>
    )
}

export default CardCarousel