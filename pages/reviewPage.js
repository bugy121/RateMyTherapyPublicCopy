import NavBar from "../components/navBar"
import VerticalScroll from "../components/verticalScroll"
import { Box, Flex, Stack, Menu, MenuButton, Button, MenuList, MenuOptionGroup, MenuItemOption, MenuItem } from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'
import GMap from '../components/GoogleMap'
import { useEffect, useContext, useState } from 'react'
import { StateContext } from "./_app"
import { LoadScript } from '@react-google-maps/api';
import Image from 'next/image'
import FuzzySearch from 'fuzzy-search'
import haversine from 'haversine-distance'
import { Search, Funnel, XSquareFill as XSquare, Map} from 'react-bootstrap-icons';
import { stat } from "fs"
import FadeIn from 'react-fade-in/lib/FadeIn'
import { Spin } from 'antd'

const GOOGLE_API_KEY = 'AIzaSyCTFjsOkOx6a2s8WoIS9pHFfdiqGTOECv8'

const filter = (lst, filterBy) => {
    switch (filterBy) {
        case 'mostRated':
            //console.log('doing the most rated filter')
            lst.sort((a, b) => b.avgStats.numReviews - a.avgStats.numReviews)
            break
        case 'highestRated':
            lst.sort((a, b) => b.avgStats.avgS - a.avgStats.avgS)
            break
        case 'bestPay':
            lst.sort((a, b) => b.avgStats.avgP - a.avgStats.avgP)
            break
        case 'bestCulture':
            lst.sort((a, b) => b.avgStats.avgC - a.avgStats.avgC)
            break
        case 'bestProductivity':
            lst.sort((a, b) => b.avgStats.avgPr - a.avgStats.avgPr)
            break
    }
}

function ReviewPage() {

    let { state, setState } = useContext(StateContext)
    const initCheckBoxState = {
        mostRated: false,
        highestRated: false,
        bestPay: false,
        bestCulture: false, 
        bestProductivity: false,
    }
    let [ checkBoxState, setCheckBoxes ] = useState(initCheckBoxState)

    useEffect(() => {
        setState({...state, isLoadingCompanies: true});
        fetch('/api/getAllCompanies').then((response) => response.json()).then(
            (data) => {
                if (data.data) {
                state.reviewPageCompanies = data.data
                state.searchOptions.filteredCompanies = data.data
                if (state.searchOptions.filteredCompanies.length > 0) {
                    state.mapCenter = state.searchOptions.filteredCompanies[0].location
                    console.log(state.mapCenter)
                }
                setState({...state, isLoadingCompanies: false})
                }
            }
        )
    }, [])


    const handleEnterKey = (key) => {
        if (key == 'Enter') {
            searchCompanies();
        }
    }

    const handleSearchOptions = (e, f) => {
        state.searchOptions[f] = e.target.value
        setState(JSON.parse(JSON.stringify(state)))
    }

    const clearFilters = () => {
        let checkBoxes = Array.from(document.getElementsByClassName('reviewCheckBox'))
        for (let i = 0; i < checkBoxes.length; i++) {
            checkBoxes[i].checked = false
        }
        setCheckBoxes(initCheckBoxState)
        searchCompanies()
    }
    const clearSearch = () => {
        let lst = document.getElementsByClassName('reviewPageInput')
        lst[0].value = ''
        lst[1].value = ''
        state.searchOptions['search'] = ''
        state.searchOptions['location'] = ''
        setState(JSON.parse(JSON.stringify(state)))
        console.log(state.searchOptions)
        searchCompanies()
    }
    async function searchCompanies() {
            //TODO connect this to the new api call
            setState({...state, isSearchingCompanies: true})
            fetch('/api/searchCompanies', {
                method: 'GET',
                headers: {
                    searchinput: state.searchOptions.search,
                    locationinput: state.searchOptions.location,
                    mostrated: checkBoxState.mostRated,
                    highestrated: checkBoxState.highestRated,
                    bestpay: checkBoxState.bestPay,
                    bestculture: checkBoxState.bestCulture,
                    bestproductivity: checkBoxState.bestProductivity,
                }
            }).then((response) => response.json()).then(
                (data) => {
                    state.searchOptions.filteredCompanies = data.companies
                    state.clickedOnCompany = -1;
                    setState({...state, isSearchingCompanies: false})
                }
            )

            /* previous code for reference
                state.searchOptions.filteredCompanies = result
                state.clickedOnCompany = -1; //this is to make sure we can still render
                //console.log('final query', result)
                setState(JSON.parse(JSON.stringify(state)))
            */
        }

    const changeMapSize = () => {
        if (state.mapWidth == '45vw') {
            state.mapWidth = '25vw'
        } else {
            state.mapWidth = '45vw'
        }
        setState(JSON.parse(JSON.stringify(state)))
    }

    const checkBoxes = (e, val) => {
        checkBoxState[val] = e.target.checked
        setCheckBoxes(JSON.parse(JSON.stringify(checkBoxState)))
        //console.log(checkBoxState)
    }
    const handleFilterPopupInnerClick = (val) => {
        checkBoxState[val] = !checkBoxState[val];
        setCheckBoxes(JSON.parse(JSON.stringify(checkBoxState)))
        //console.log(checkBoxState)
    }

    const handleFilterPopupClick = () => {
        state.filterPopupOpen = !state.filterPopupOpen
        setState(JSON.parse(JSON.stringify(state)))
    }
    const handleMapPopupClick = () => {
        state.mapPopupOpen = !state.mapPopupOpen
        setState(JSON.parse(JSON.stringify(state)))
    }
    const mapPopup = () => {
        //console.log(state.mapPopupOpen)
        if (!state.mapPopupOpen) {
            return;
        }
        return (
            <Flex justify='center'>
                <Box className='smallGMAP'  h='98vw' w='98vw' style={{'boxShadow': 'rgba(0, 0, 0, 0.35) 0px 5px 15px'}}>
                        <GMap className='zeroZIndex' height='98vw' width='98vw'/>
                </Box>
            </Flex>
        )
    }

    const filterPopup = () => {
        if (!state.filterPopupOpen) {
            return;
        }
        return (
            <Flex justify='center' mb='25px'>
            <Box bg='#C33C54' borderRadius='10px' pt='2px' pb='2px' ml='45px' mr='45px'>
                    {/*<Box w='95vw' h='2px' bg='#FAF9F6' m='auto'></Box>*/}
                <Flex justify='center' color='white' direction='column' mt='15px' mb='10px'  fontSize='19px' fontWeight='700'>
                    <Flex ml='25px' mr='25px'>
                        <input className='coolCheckBox reviewCheckBox' type='checkbox' onChange={(e) => (checkBoxes(e, 'mostRated'))} />
                        <Box ml='5px'>Most Rated</Box>
                    </Flex>
                    <Flex ml='25px' mr='25px'>
                        <input className='coolCheckBox reviewCheckBox' type='checkbox' onChange={(e) => (checkBoxes(e, 'highestRated'))} />
                        <Box ml='5px'>Highest Rated</Box>
                    </Flex>
                    <Flex ml='25px' mr='25px'>
                        <input className='coolCheckBox reviewCheckBox' type='checkbox' onChange={(e) => (checkBoxes(e, 'bestPay'))} />
                        <Box ml='5px'>Best Pay</Box>
                    </Flex>
                    <Flex ml='25px' mr='25px'>
                        <input className='coolCheckBox reviewCheckBox' type='checkbox' onChange={(e) => (checkBoxes(e, 'bestCulture'))} />
                        <Box ml='5px'>Best Culture</Box>
                    </Flex>
                    <Flex ml='25px' mr='25px'>
                        <input className='coolCheckBox reviewCheckBox' type='checkbox' onChange={(e) => (checkBoxes(e, 'bestProductivity'))} />
                        <Box ml='5px'>Best Productivity</Box>
                    </Flex>

                    <Flex mt='10px'>
                        <Box className='closeFiltersButton' cursor='pointer' bg='#C33C54' color='white' p='5px' borderRadius='5px' pr='10px' pl='10px' mt='-2px' ml='7px' fontSize='17px' onClick={() => clearFilters()}><XSquare className='closeIcon' /></Box>
                    </Flex>
                </Flex>
                {/*<Box w='95vw' h='2px' bg='#FAF9F6' m='auto'></Box> */}
            </Box>

            <Box h='20px' bg='#152f46'></Box>
        </Flex>
        )
    }
    return (
        <Box className='loadScriptTag'>
            <LoadScript googleMapsApiKey={GOOGLE_API_KEY} >
                <Box bg='#152f46'>

                <Box className='reviewPageHorizMobile' h='40px'></Box>

                <Flex pt='15px' mb='12px' justify='center'>
                    <FadeIn delay='50' transition='700'>
                        <Box className='reviewPageTitle' align='center' m='12' pt='5px' mb='10px' p='1px' pr='20px' pl='20px' borderRadius='14px' fontSize='42px' fontWeight='700' color='white'>Company Reviews</Box>
                    </FadeIn>
                </Flex>



                {/* Container for search bar and buttons on mobile Also includes filter dropdown list for mobile as well*/}
                <FadeIn delay='100' transition='700'>
                <Flex align='center' direction='row' justify='center' mb='5' mt='0' pb='20px' bg='#152f46' className='searchInputs'>
                    <input onKeyDown={(e) => handleEnterKey(e.key)} className='reviewPageInput coolBoxShadow' type='text' placeholder='Search' onInput={(e) => handleSearchOptions(e, 'search')} ></input>
                    <input onKeyDown={(e) => handleEnterKey(e.key)} className='reviewPageInput coolBoxShadow' type='text' placeholder='Location' onInput={(e) => handleSearchOptions(e, 'location')}></input>
                    
                    <Flex className='reviewPageButtonsContainer'>
                        {Array(1).fill(0).map(() => {
                            if (!state.isSearchingCompanies) {
                                return (
                                    <Flex className='searchButton coolBoxShadow'cursor='pointer' ml='5px' color='white' fontSize='20px' fontWeight='600' bg='#0070f3' p='5px' pr='10px' pl='10px' borderRadius='5px' onClick={searchCompanies}>
                                        Search
                                        <Box ml='10px'><Search className='searchButtonThing' /></Box>
                                    </Flex>
                                )
                            } else {
                                return (
                                    <Flex className='searchButton coolBoxShadow' ml='5px' color='#23C9FF' bg='white' fontSize='20px' fontWeight='600' p='5px' pr='10px' pl='10px' borderRadius='5px'>
                                        <Spin className='searchingCompaniesSpinner'/>
                                        <Box ml='10px'><Search className='searchButtonThing' /></Box>
                                    </Flex>
                                )
                            }
                        })}

                        
                        <Box className='filterPopupButton mapIcon coolBoxShadow' mr='10px' bg='#23C9FF' w='46px' cursor='pointer' ml='8px' color='white' fontSize='20px' fontWeight='800' p='5px' pr='10px' pl='10px' borderRadius='5px'>
                            <Box className='coolBoxshadow mapIcon' onClick={() => handleMapPopupClick()} fontSize='25px' h='30px' fontWeight='900' ><Map className='funnelForPopup' /></Box>
                        </Box>
                        
                        <Box className='filterMenuOuterContainer coolBoxShadow'>
                            <Menu className='outerMenu' closeOnSelect={false}>
                                <MenuButton className='coolBoxShadow' bg='#23C9FF' h='40px' border='0px' color='white' fontSize='20px'  borderRadius='6px' as={Button}>
                                    <Box fontSize='20px' pb='10px' h='30px' fontWeight='600' >Filter</Box>
                                </MenuButton>
                                <MenuList className='filterMenuList'>
                                    <MenuOptionGroup type='checkbox' >
                                        <MenuItemOption className='menuOptionFilter' borderTopRadius='7px' value='PT' onClick={() => (handleFilterPopupInnerClick('mostRated'))}>Most Rated</MenuItemOption>
                                        <MenuItemOption className='menuOptionFilter' value='OT' onClick={() => (handleFilterPopupInnerClick('highestRated'))}>Highest Rated</MenuItemOption>
                                        <MenuItemOption className='menuOptionFilter' value='SLP' onClick={() => (handleFilterPopupInnerClick('bestPay'))}>Best Pay</MenuItemOption>
                                        <MenuItemOption className='menuOptionFilter' value='PTA' onClick={() => (handleFilterPopupInnerClick('bestCulture'))}>Best Culture</MenuItemOption>
                                        <MenuItemOption className='menuOptionFilter' value='COTA' onClick={() => (handleFilterPopupInnerClick('bestProductivity'))}>Best Productivity</MenuItemOption>
                                        <MenuItem className='menuOptionFilter' borderBottomRadius='7px' color='white' pl='30px' bg='#C33C54' onClick={() => clearFilters()}>Clear Filters</MenuItem>
                                    </MenuOptionGroup>
                                </MenuList>
                            </Menu>
                        </Box>

                        <Flex className='closeSearchButton coolBoxShadow' cursor='pointer' ml='8px' color='white' fontSize='20px' fontWeight='800' bg='#C33C54' p='5px' pr='10px' pl='10px' borderRadius='5px'>
                            <Box fontSize='20px' pb='10px' h='30px' fontWeight='600' onClick={() => clearSearch()}>Clear</Box>
                        </Flex>

                    </Flex>
                </Flex>
                </FadeIn>


                {/* Container for horizontal filter menu bar on larger screens*/}
                <Box className='filterContainer'>
                    <FadeIn delay='150' transition='700'>
                    <Box className='innerFilterContainer' bg='#1c5891' borderRadius='10px' pt='2px' pb='2px' ml='45px' mr='45px'>
                            {/*<Box w='95vw' h='2px' bg='#FAF9F6' m='auto'></Box>*/}
                            <Flex justify='center' color='white' mt='15px' mb='10px'  fontSize='19px' fontWeight='600'>
                            <Flex ml='25px' mr='25px'>
                                <label className='checkBoxContainer'>
                                    <input className='styledCheckBox reviewCheckBox' type='checkbox' onChange={(e) => (checkBoxes(e, 'mostRated'))} />
                                    <span className='styledCheckmark'></span>
                                </label>
                                <Box ml='5px'>Most Rated</Box>
                            </Flex>
                            <Flex ml='25px' mr='25px'>
                                <label className='checkBoxContainer'>
                                    <input className='styledCheckBox reviewCheckBox' type='checkbox' onChange={(e) => (checkBoxes(e, 'highestRated'))} />
                                    <span className='styledCheckmark'></span>
                                </label>
                                <Box ml='5px'>Highest Rated</Box>
                            </Flex>
                            <Flex ml='25px' mr='25px'>
                                <label className='checkBoxContainer'>
                                    <input className='styledCheckBox reviewCheckBox' type='checkbox' onChange={(e) => (checkBoxes(e, 'bestPay'))} />
                                    <span className='styledCheckmark'></span>
                                </label>
                                <Box ml='5px'>Best Pay</Box>
                            </Flex>
                            <Flex ml='25px' mr='25px'>
                                <label className='checkBoxContainer'>
                                    <input className='styledCheckBox reviewCheckBox' type='checkbox' onChange={(e) => (checkBoxes(e, 'bestCulture'))} />
                                    <span className='styledCheckmark'></span>
                                </label>
                                <Box ml='5px'>Best Culture</Box>
                            </Flex>
                            <Flex ml='25px' mr='25px'>
                                <label className='checkBoxContainer'>
                                    <input className='styledCheckBox reviewCheckBox' type='checkbox' onChange={(e) => (checkBoxes(e, 'bestProductivity'))} />
                                    <span className='styledCheckmark'></span>
                                </label>
                                <Box ml='5px'>Best Productivity</Box>
                            </Flex>
                            <Box className='closeFiltersButton coolBoxShadow' cursor='pointer' bg='#C33C54' color='white' p='5px' borderRadius='5px' pr='10px' pl='10px' mt='-2px' ml='7px' fontSize='17px' onClick={() => clearFilters()}>Clear Filters</Box>
                        </Flex>
                        {/*<Box w='95vw' h='2px' bg='#FAF9F6' m='auto'></Box> */}
                    </Box>
                    <Box h='20px' bg='#152f46'></Box>
                    </FadeIn>
                </Box>


                {/* These two functionc calls are for popups for smaller screens*/}
                {filterPopup()}
                {mapPopup()}
                

                <Box className='spacerReviewPage' h='00px' w='100vw'></Box>

                {/* Results bar*/}
                <FadeIn delay='200' transition='700'>
                <Flex justify='center' mb='20px'>
                    <Box w='30%' bg='white' h='2px' mt='16px'></Box>
                    <Box className='coolBoxShadow' color='white' w='100px' fontSize='15' bg='#0070f3' ml='12px' mr='12px' p='5px' pr='10px' pl='10px' borderRadius='8px' fontWeight='700'>{state.searchOptions.filteredCompanies.length} Results</Box>
                    <Box w='30%' bg='white' h='2px' mt='16px'></Box>
                </Flex>
                </FadeIn>

                <Flex justify='center' >
                    <VerticalScroll />
                    
                   
                        <Box className='GMAP'  h='80vh' ml='50px' style={{'boxShadow': 'rgba(0, 0, 0, 0.35) 0px 5px 15px'}}>
                            <FadeIn delay='300' transition='700'>
                            <GMap height='80vh' width={state.mapWidth}/>
                            </FadeIn>
                        </Box>
                    
                    
                
                </Flex>
                    
                    
                </Box>
            </LoadScript>
        </Box>
    )
}

export default ReviewPage

/*

            <Box bg='#152f46'>
                
                <Box className='reviewPageTitle' align='center' m='12' pt='5px' mb='15px' fontSize='70px' fontWeight='900' color='white'>Company Reviews</Box>
                <Flex align='center' justify='center' mb='5' mt='0' pb='20px' bg='#152f46' className='searchInputs'>
                    <input className='reviewPageInput' type='text' placeholder='Search' onInput={(e) => handleSearchOptions(e, 'search')} ></input>
                    <input className='reviewPageInput' type='text' placeholder='Location' onInput={(e) => handleSearchOptions(e, 'location')}></input>
                    <Flex className='searchButton' cursor='pointer' ml='5px' color='white' fontSize='20px' fontWeight='800' bg='#23C9FF' p='5px' pr='10px' pl='10px' borderRadius='5px' onClick={searchCompanies}>
                        Search
                       <Box ml='10px'><Search className='searchButtonThing' /></Box>
                    </Flex>

                    <Flex className='closeSearchButton' cursor='pointer' ml='8px' color='white' fontSize='20px' fontWeight='800' bg='#C33C54' p='5px' pr='10px' pl='10px' borderRadius='5px'>
                
                       <Box fontSize='25px' h='30px' fontWeight='900' onClick={() => clearSearch()}><XSquare className='searchClose' /></Box>
                    </Flex>
            
                </Flex>
                
                
                <Box className='filterContainer' bg='#C33C54' borderRadius='10px' pt='2px' pb='2px' ml='45px' mr='45px'>
                    {<Box w='95vw' h='2px' bg='#FAF9F6' m='auto'></Box>} //this should be commented out as well
                    <Flex justify='center' color='white' mt='15px' mb='10px'  fontSize='19px' fontWeight='800'>
                    <Flex ml='25px' mr='25px'>
                        <input className='coolCheckBox' type='checkbox' onChange={(e) => (checkBoxes(e, 'mostRated'))} />
                        <Box ml='5px'>Most Rated</Box>
                    </Flex>
                    <Flex ml='25px' mr='25px'>
                        <input className='coolCheckBox' type='checkbox' onChange={(e) => (checkBoxes(e, 'highestRated'))} />
                        <Box ml='5px'>Highest Rated</Box>
                    </Flex>
                    <Flex ml='25px' mr='25px'>
                        <input className='coolCheckBox' type='checkbox' onChange={(e) => (checkBoxes(e, 'bestPay'))} />
                        <Box ml='5px'>Best Pay</Box>
                    </Flex>
                    <Flex ml='25px' mr='25px'>
                        <input className='coolCheckBox' type='checkbox' onChange={(e) => (checkBoxes(e, 'bestCulture'))} />
                        <Box ml='5px'>Best Culture</Box>
                    </Flex>
                    <Flex ml='25px' mr='25px'>
                        <input className='coolCheckBox' type='checkbox' onChange={(e) => (checkBoxes(e, 'bestProductivity'))} />
                        <Box ml='5px'>Best Productivity</Box>
                    </Flex>
                    <Box className='applyFiltersButton' cursor='pointer' bg='#23C9FF' color='white' p='5px' borderRadius='5px' pr='10px' pl='10px' mt='-2px' ml='20px' fontWeight='900' fontSize='17px' onClick={() => filterEverything()}>Apply Filters <Funnel className='funnelIcon' /></Box>
                    <Box className='closeFiltersButton' cursor='pointer' bg='#C33C54' color='white' p='5px' borderRadius='5px' pr='10px' pl='10px' mt='-2px' ml='7px' fontSize='17px' onClick={() => clearFilters()}><XSquare className='closeIcon' /></Box>
                </Flex>
            {/*<Box w='95vw' h='2px' bg='#FAF9F6' m='auto'></Box> } //should be commented out
        </Box>
       

        <Flex justify='center'>
            <VerticalScroll />

            <Box className='GMAP'  h='80vh' mt='15' ml='190px' mr='20px' style={{'boxShadow': 'rgba(0, 0, 0, 0.35) 0px 5px 15px'}}>
                <GMap height='80vh' width={state.mapWidth}/> {/* 45vw } //should be commented out
                <Box h='50px' w='50px' bg='white' className='expandButton' onClick={changeMapSize}></Box>
            </Box>

            
        </Flex>
        
    </Box>





*/