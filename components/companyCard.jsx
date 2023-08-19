import { Box, Image } from '@chakra-ui/react'

function CompanyCard({mr, ml}) {
    const shadowStyle={'boxShadow': 'rgba(0, 0, 0, 0.35) 0px 5px 15px'};
    return (
        
        <Box bg='white' w='200px' h='200px' mr={mr} ml={ml} className='d-block' style={shadowStyle}>
            <Image h='' src='' alt='pic'/>
        </Box>
    )
}

export default CompanyCard