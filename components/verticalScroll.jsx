import { Box, Flex } from '@chakra-ui/react'
import ReviewPageCard from './reviewPageCard'
import { StateContext } from '../pages/_app'
import { useContext } from 'react'
import FadeIn from 'react-fade-in/lib/FadeIn'
import { Spin } from 'antd'

function VerticalScroll() {
    let { state, setState } = useContext(StateContext)
    const renderCards = () => {
        console.log('in this function')
        if (!state.ReviewPageCompanies) {
            return
        }
        state.ReviewPageCompanies.map((_ , ind) => {
            if (ind % 2 == 0) {
                console.log('sss')
                return (
                <Flex key={1} m='30px' ml='0px' mt='10px' className='reviewPageCardContainer'>
                    <ReviewPageCard key={ind} w='300px' h='210px'/>
                    <ReviewPageCard key={ind + 1} w='300px' h='210px'/>
                </Flex>
                )
            }
        })
    }
    console.log('filtered', state)
    if (state.searchOptions.filteredCompanies.length == 0) {
        console.log(state.isLoadingCompanies)
        if (!state.isLoadingCompanies) {
            return (
                <Box className='noResults' mb='20vh' bg='white' w='50%' borderRadius='10px' fontSize='20px' fontWeight='600' color='black' align='center' p='30px' pt='54px' h='200px'>
                    Sorry, no results for that search. Try searching something else or add the company yourself!
                </Box>
            )
        }
        return (
            <Box className='noResults' mb='20vh' bg='white' w='50%' borderRadius='15px' fontSize='23px' fontWeight='600' color='black' align='center' p='30px' pt='80px' h='200px'>
                Loading Companies <Spin size='large' className='verticalScrollSpinner' />
            </Box>
        )

    }
    return (
        <Box className='vertScroll' align='center' mt='0px' mb='20vh'>  

            {Array(1).fill(0).map(() => {
                if (state.clickedOnCompany != -1) {
                    return(
                    <FadeIn key={state.clickedOnCompany} delay='50' transitionDuration='700'>
                        <Box key={state.clickedOnCompany} mb='20px' className='reviewPageCardContainer'>
                            <ReviewPageCard k={state.clickedOnCompany} w='800px' h='210px' bg='#93d7f5'/>
                        </Box>
                    </FadeIn>)
                }
            })}

            {
                state.searchOptions.filteredCompanies.map((_ , ind) => {
                    if (ind == state.clickedOnCompany) return
                    if (true) {
                        return (
                        <FadeIn key={ind} delay={230 + (ind + 1) * 60} transitionDuration='700'>
                            <Box key={ind} mb='20px' className='reviewPageCardContainer'>
                                <ReviewPageCard k={ind} w='800px' h='210px'/>
                            </Box>
                        </FadeIn>
                        )
                    }
                })
            }
        </Box>
    )
}

export default VerticalScroll