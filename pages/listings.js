import { Box, Flex, Spacer, Menu, MenuButton, Button, ChevronDownIcon, MenuList, MenuItem, Select, Popover, PopoverTrigger, PopoverContent} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import styles from '../styles/listings.module.css';
import { Search, Funnel, XSquare, CaretLeftFill, CaretRightFill, InfoCircleFill, XCircle} from 'react-bootstrap-icons';
import FuzzySearch from 'fuzzy-search'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'
import FadeIn from 'react-fade-in/lib/FadeIn'


/* TODO:
    add the delete pathway, add the city field
*/
export default function Listings() {
    const router = useRouter()
    let [listings, setListings] = useState([])
    let [ogListings, setOgListings] = useState();
    let [searchInput, setSearchInput] = useState('');
    let [maxPage, setMaxPage] = useState(1)
    let [infoPopupOpen, setInfoPopupOpen] = useState(false)
    let filterInit = {
        searchInput: '',
        pageNum: 0,
        specialty: 'None',
        setting: 'None',
        payMin: '',
        payMax: '',
        location: '',
    }
    let [filterOpen, setFilterOpen] = useState(false);
    let [filterOptions, setFilterOptions] = useState(filterInit);

    let handleFilterChange = (e, field) => {
        filterOptions[field] = e.target.value
        setFilterOptions(JSON.parse(JSON.stringify(filterOptions)))
        console.log(filterOptions)
    }
    const renderPopup = () => {
        // if (!infoPopupOpen) return
        return (
            <Flex className={styles.labelsInfoBox} direction='column' m='auto' w='200px' justify='center' fontSize='26px' fontWeight='700' bg='#C33C54' p='20px' borderRadius='10px' color='white'>
                <Box align='center'>Format:</Box>
                <Box fontWeight='300' fontSize='18'>
                    <Box align='center'>Specialty</Box>
                    <Box align='center'>Location</Box>
                    <Box align='center'>Setting</Box>
                    <Box align='center'>Weekly Pay</Box>
                </Box>
            </Flex>
        )
    }
    useEffect(() => {
        fetch('/api/getListings?pageNum=0').then((response) => response.json()).then(
            (data) => {
                setListings(data.data)
                setOgListings(data.data)
                setMaxPage(data.maxPage)
            }
        )
    }, [])

    const search = () => {
        fetch(`/api/getListings?searchInput=${filterOptions.searchInput}&pageNum=${filterOptions.pageNum}`).then((response) => response.json().then(
            (data) => {
                console.log(data.data)
                setListings(data.data)
            }
        ))
    }
    async function executeSearchFilter() {
        let {searchInput, pageNum, specialty, setting, payMin, location} = filterOptions
        let res = await fetch (`/api/getListings2?searchInput=${searchInput}&pageNum=${pageNum}&specialty=${specialty}&setting=${setting}&payMin=${payMin}&location=${location}`)
        console.log(res.ok)
        let data = await res.json()
        console.log(data)
        if (!res.ok) {
            toast.error(data.message)
            return
        }
        setListings(data.data)
    }
    const changePage = (inp) => {
        console.log(filterOptions)
        switch(inp) {
            case ('up'):
                filterOptions.pageNum = filterOptions.pageNum + 1;
                setFilterOptions(JSON.parse(JSON.stringify(filterOptions)));
                executeSearchFilter();
                break;
            case('down'):
                if (filterOptions.pageNum == 0) return;
                filterOptions.pageNum = filterOptions.pageNum - 1;
                setFilterOptions(JSON.parse(JSON.stringify(filterOptions)));
                executeSearchFilter();  
                break;
        }
        window.scrollTo(0, 0)
    }
    const clearFilters = () => {
        setFilterOptions(filterInit);
    }
    const handleEnterKey = (key) => {
        if (key == "Enter") {
            executeSearchFilter();
        }
    }
    const renderFilterPopup = () => {
        // if (!filterOpen) return
        return (
            <Box className={styles.leaveReviewFilters} bg='white' p='20px' pt='6px' borderRadius='5px' fontSize='18px' fontWeight='500' w='280px' align='center' color='black'>
                <Box h='1px' mt='25px' mb='9px' w='100%' bg='#bfbdb8'></Box>
                <Box align='center' fontWeight='700'>Filter Options</Box>
                <Box h='1px' mt='9px' mb='9px' w='100%' bg='#bfbdb8'></Box>
                <Flex mb='5px' mt='15px'>
                    <Box mr='45px'>Specialty:</Box>
                    <Box mb='10px' fontSize='18px' fontWeight='500'>
                        <select className={styles.options} onChange={(e) => handleFilterChange(e, 'specialty')}>
                            <option selected={filterOptions.specialty=='None'? 'selected':''} value='None'>None/Other</option>
                            <option selected={filterOptions.specialty=='COTA'? 'selected':''} value='COTA'>COTA</option>
                            <option selected={filterOptions.specialty=='OT'? 'selected':''} value='OT'>OT</option>
                            <option selected={filterOptions.specialty=='PT'? 'selected':''} value='PT'>PT</option>
                            <option selected={filterOptions.specialty=='PTA'? 'selected':''} value='PTA'>PTA</option>
                            <option selected={filterOptions.specialty=='SLP'? 'selected':''} value='SLP'>SLP</option>
                            <option selected={filterOptions.specialty=='SLPA'? 'selected':''} value='SLPA'>SLPA</option>
                        </select>
                    </Box>
                </Flex>
                <Box h='1px' mt='9px' mb='16px' w='100%' bg='#bfbdb8'></Box>
                <Flex>
                    <Box mr='63px'>Setting:</Box>
                    <Box>
                        <select className={styles.options}  onChange={(e) => handleFilterChange(e, 'setting')}>
                            <option selected={filterOptions.setting=='None'? 'selected':''} value='None'>None/Other</option>
                            <option selected={filterOptions.setting=='School'? 'selected':''} value='School'>School</option>
                            <option selected={filterOptions.setting=='Outpatient'? 'selected':''}value='Outpatient'>Outpatient</option>
                            <option selected={filterOptions.setting=='Skilled'? 'selected':''} value='Skilled'>Skilled</option>
                            <option selected={filterOptions.setting=='Home Health'? 'selected':''} value='Home Health'>Home Health</option>
                            <option selected={filterOptions.setting=='Skilled Nursing Facility - SNF'? 'selected':''} value='Skilled Nursing Facility - SNF'>Skilled Nursing Facility - SNF</option>
                            <option selected={filterOptions.setting=='Orthopedics'? 'selected':''} value='Orthopedics'>Orthopedics</option>
                            <option selected={filterOptions.setting=='Hospital'? 'selected':''} value='Hospital'>Hospital</option>
                        </select>
                    </Box>
                </Flex>
                <Box h='1px' mt='17px' mb='9px' w='100%' bg='#bfbdb8'></Box>
                <Flex mt='10px' justify='center'>
                    <Box mr='60px' pt='5px'>Min Pay: </Box>
                    <Box mr='10px'><input type='text' value={filterOptions.payMin} className={styles.moneyInputs} placeHolder='min' onInput={(e) => handleFilterChange(e, 'payMin')}></input></Box>
                </Flex>
                <Box h='1px' mt='9px' mb='9px' w='100%' bg='#bfbdb8'></Box>
                <Box align='center'>
                    <Box mb='5px'>Location:</Box>
                    <input type='text' value={filterOptions.location} className={styles.locationInput} placeholder='location' onInput={(e) => handleFilterChange(e, 'location')}></input>
                </Box>
                <Box h='1px' mt='9px' mb='9px' w='100%' bg='#bfbdb8'></Box>
                <Flex justify='center' color='white' fontSize='18px' fontWeight='600'>
                    <Box cursor='pointer' className={styles.applyFilters} onClick={() => executeSearchFilter()}borderRadius='5px' p='10px' bg='#0070f3' mr='20px'>Apply Filters</Box>
                    <Box cursor='pointer' onClick={() => clearFilters()} className={styles.clearFilters} borderRadius='5px' p='10px' bg='#eb4034'>Clear</Box>
                </Flex>
                <Box h='1px' mt='9px' mb='9px' w='100%' bg='#bfbdb8'></Box>
            </Box>
        )
    }

    return (
    <Box bg='#152f46' color='white' pt='40px' position='relative'>
        {/* <Box className={styles.horizLineTop} h='2px' bg='white' w='80%' m='auto'></Box> */}

        <FadeIn delay='50' transition='700'>
            <Flex justify='center'>
                <Box className={styles.title} fontSize='55px' bg='#1c5891' padding='10px' w='82%' borderRadius='10px' fontWeight='800' align='center' m='20px'>Job Listings</Box>
            </Flex>
        </FadeIn>

        <FadeIn delay='100' transition='700'>
            <Box className={styles.description} w='80%' m='auto' mb='20px' fontSize='20px' fontWeight='500' align='center'>Here is where you can find up-to-date information about current travel jobs. If you see a job that interests you, click the button below to be connected with a recruiter. We can match you automatically as well! Click the Match Me button and fill in the form with your preferences so we can find the best match for you.</Box>
            <Flex className={styles.buttons} justify='center'>
                <Box w='225px' cursor='pointer' mb='15px' className={styles.recruiterButton}><a className={styles.link} rel='noreferrer' target='_blank' href='https://docs.google.com/forms/d/107H5LP-0oCdkdV7NpWRSNKYKmn4KbAFXYQIDlGBKEhE/viewform?edit_requested=true'>Connect To Recruiter</a></Box>
                <Box w='10px'></Box>
                <Box w='160px' pl='31px' pr='31px' cursor='pointer' mb='15px' className={styles.recruiterButton}><a className={styles.link} rel='noreferrer' target='_blank' href='https://docs.google.com/forms/d/e/1FAIpQLSc7WHcB7OqenYZrk071cVsp8eXKGOXJWqBSvLO7mBp3Au9Ujw/viewform'>Match Me!</a></Box>
            </Flex>
        </FadeIn>
        {/* <Box className={styles.horizLineTop} h='2px' bg='white' w='80%' m='auto'></Box> */}
        

        <FadeIn delay='150' transition='700'>
            <Box mt='50px'>
                <Flex className={styles.searchInputContainer} justify='center' direction='row'>
                    
                    <Flex justify='center'>
                        <input type='text' placeholder='search by anything' onKeyDown={(e) => handleEnterKey(e.key)} className={styles.search} onInput={(e) => handleFilterChange(e, 'searchInput')}/>
                        <Box cursor='pointer' w='51px' ml='10px' bg='#23C9FF' p='5px' pl='10px' pr='10px' className={styles.searchButton} borderRadius='6px' fontSize='25px' fontWeight='800' onClick={() => executeSearchFilter()}><Search className={styles.searchIcon}/></Box>
                    </Flex>
                    <Flex className={styles.lowerSearchInputs} ml='12px' justify='center'>
                        <Box position='relative' className='listingFiltersContainer'>
                            <Popover>
                                <PopoverTrigger>
                                    <Flex h='51px' className={styles.funnelContainer} fontSize='33px' pt='9px' pl='13px' pr='13px' borderRadius='5px' bg='#c33b54' color='white' onClick={() => setFilterOpen(!filterOpen)}>
                                        <Box fontSize='20px' fontWeight='700'>Filters</Box>
                                        <Funnel className={styles.funnelIcon} />
                                    </Flex>
                                </PopoverTrigger>
                                <PopoverContent>
                                    {renderFilterPopup()}
                                </PopoverContent>
                            </Popover>
                            {/* {renderFilterPopup()} */}
                        </Box>
                        <Popover>
                            <PopoverTrigger>
                                <Box className={styles.infoButton} ml='15px' fontSize='30px' color='white' ><InfoCircleFill className='infoCircleIcon' /></Box>
                            </PopoverTrigger>
                            <PopoverContent>
                                {renderPopup()}
                            </PopoverContent>
                        </Popover>
                        
                    </Flex>
                </Flex>
            </Box>
        </FadeIn>

        <Box h='30px'></Box>

        <Box>

            <FadeIn delay='200' transition='700'>
            <Flex className={styles.labels} m='auto' mb='50px' w='80%' justify='center' fontSize='25px' fontWeight='600' bg='#C33C54' p='20px' borderRadius='10px' color='white'>
                <Box w='250px' align='center'>Specialty</Box>
                <Box w='5%'></Box>
                <Box w='250px' align='center'>Location</Box>
                <Box w='5%'></Box>
                <Box w='250px' align='center'>Setting</Box>
                <Box w='5%'></Box>
                <Box w='250px' align='center'>Weekly Pay</Box>
            </Flex>
            </FadeIn>

            {Array(1).fill(0).map((_) => {
                if (listings.length == 0) {
                    return (
                        <Flex key={_} fontSize='20px' justify='center' direction='column' align='center'>
                            <Box fontWeight='500' bg='#23C9FF' p='10px' w='80%' pt='20px' pb='20px' align='center' borderRadius='10px'>Sorry, no results for that. Try seaching something different!</Box>
                            <Box className='spacer' h='30vh'></Box>
                        </Flex>
                    )
                }
            })}

            {listings.map((e, i) => (
                <FadeIn delay={250 + 50 * i} transition='700'>
                <Flex className={styles.singleListing} direction='row' key={e} m='auto' mt='15px' mb='15px' w='80%' justify='center' fontSize='20px' fontWeight='600' bg='#0070f3' p='20px' borderRadius='10px' color='white'>
                    <Box  className={styles.infoContainer} w='250px' align='center'>{e.specialty}</Box>
                    <Box w='5%'></Box>
                    <Box className={styles.infoContainer} w='250px' align='center'>{e.city}, {e.state}</Box>
                    <Box w='5%'></Box>
                    <Box className={styles.infoContainer} w='250px' align='center'>{e.setting}</Box>
                    <Box w='5%'></Box>
                    <Box className={styles.infoContainer} w='250px' align='center'>{e.weeklyPay}</Box>
                </Flex>
                </FadeIn>
            ))}
            <Flex justify='center' mt='25px'>
                <CaretLeftFill onClick={() => changePage('down')} cursor='pointer' className={styles.caret}/>
                <Box bg='#C33C54' p='10px' mb='2px' borderRadius='5px' fontWeight='500' fontSize='20px'>Page {filterOptions.pageNum + 1}</Box>
                <CaretRightFill onClick={() => changePage('up')} cursor='pointer' className={styles.caret}/>         
            </Flex>
       </Box>

        <Box h='50vh'></Box>
    </Box>
    )
}