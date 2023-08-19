import { Box, Flex, MenuList, MenuOptionGroup, MenuItemOption, Menu, MenuButton, Button, MenuDivider, Select } from '@chakra-ui/react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import Cookies from 'js-cookie'
import { Popover } from 'antd';
import { PlusSquareFill, DashSquareFill } from 'react-bootstrap-icons'
import FadeIn from 'react-fade-in/lib/FadeIn'

const MAX_LOCATIONS = 6;
const baseLocation = {
    city: "",
    state: "",
    street: "",
    phoneNumber: ""
}

export default function AddCompany() {
    const router = useRouter()
    
    //locations is an array of all locations for a company
    let [locations, setLocations] = useState([ baseLocation ])
    let [numLocations, setNumLocations] = useState(1)
    let [company, setCompany] = useState({
        website: "",
        description: "",
        specialties: [],
        companyName: "",
    })
    let [errorMessage, setErrorMessage] = useState('')
    
    const updateForm = (e, f) => {
        company[f] = e.target.value
        setCompany(JSON.parse(JSON.stringify(company)))
        console.log(company)
    }
    const addSpecialty = (s) => {
        let newLst = []
        let found = false;
        for (let i = 0; i < company.specialties.length; i++) {
            if (s == company.specialties[i]) {
                found = true 
            } else {
                newLst.push(company.specialties[i])
            }
        }
        if (found) {
            company.specialties = newLst;
            setCompany(JSON.parse(JSON.stringify(company)))
        } else {
            newLst.push(s)
            company.specialties = newLst;
            setCompany(JSON.parse(JSON.stringify(company)))
        }
    }
    async function onSubmit() {
        company.locations = locations;
        console.log(company)
        let res = await fetch('/api/addCompany3', {
            method: 'POST',
            headers: {token: Cookies.get('userToken')},
            body: JSON.stringify(company)
        })
        console.log(res)
        let data = await res.json()
        let message = data.message;
        if (res.status == 200) {
            router.replace('/')
            toast.success('Successfully Added Company!')            
        } else {
            toast.error(message)
        }
    }

    //suite of functions to add/remove locations
    const updateLocation = (i, field, val) => {
        locations[i][field] = val
        setLocations(locations)
        console.log(locations)
    }
    const addLocationToList = () => {
        if (numLocations >= MAX_LOCATIONS) {
            toast.error(`Only up to ${MAX_LOCATIONS} locations allowed for a company`)
            return
        }
        locations.push(JSON.parse(JSON.stringify(baseLocation)))
        setLocations(locations)
        setNumLocations(numLocations + 1)
        console.log(locations)
    }
    const deleteLocationFromList = (i) => {
        locations.splice(i, 1)
        setLocations(locations)
        setNumLocations(numLocations - 1)
        console.log(locations)
        for (let n = 0; n < locations.length; n++) {
            document.getElementById(`cityInput${n}`).value = locations[n].city
            document.getElementById(`stateInput${n}`).value = locations[n].state
            document.getElementById(`streetInput${n}`).value = locations[n].street
            document.getElementById(`phoneInput${n}`).value = locations[n].phoneNumber
        }
    }
    const addLocationPopover = () => {
        return (
            <Box>
                Add another location to your company
            </Box>
        )
    }
    const deleteLocationPopover = () => {
        return (
            <Box>
                Delete this location
            </Box>
        )
    }


    //i: the index on the locations list
    const renderAddClosePopup = (i) => {
        if (numLocations == 1) {
            return (<Popover content={addLocationPopover}>
                <Box className='addMoreLocationsButton' onClick={() => addLocationToList()} cursor='pointer' color='#0070f3' fontSize='45px' ml='13px'><PlusSquareFill className='plusSquareFill' /></Box>
                    </Popover>)
        } else {
            return (<Popover content={deleteLocationPopover}><Box className='deleteLocationsButton' onClick={() => deleteLocationFromList(i)} cursor='pointer' color='#c33b54' fontSize='45px' ml='13px'><DashSquareFill className='dashSquareFill' /></Box>
                    </Popover>)
        }
    }
    return (
        <Box bg='#152f46'>
            <FadeIn delay='50' transition='700'>
            <Box className='spacer' h='2vw'></Box>
            <Box h='30px'></Box>
            <Flex className='addCompanyFormContainer coolBoxShadow' direction='column' bg='white' pl='40px' pr='40px' w='440px' pt='30px' pb='40px' borderRadius='5px' m='auto'>

                <Box align='center' fontSize='35px' fontWeight='700' bg='#eee5bb' borderRadius='8px' p='5px'>Add Company</Box>
                
                <Box mt='25px' align='center' fontSize='20px' fontWeight='600'>Basic Information</Box>
                <Box align='center' fontSize='15px' pl='5px' pr='5px' fontWeight='400'>A little information we need on your company! Description and website highly reccomended</Box>

                <input className='addCompanyInput' type='text' placeholder='Company Name' onInput={(e) => updateForm(e, 'companyName')}/>
                <input className='addCompanyInput' type='text' placeholder='Website (optional)' onInput={(e) => updateForm(e, 'website')}/>
                <Box className='addCompanyInput' h='100px'>
                    <textarea className='addCompanyDescriptionInput' placeholder='short description (optional)' onInput={(e) => updateForm(e, 'description')}></textarea>
                </Box>
                <Menu closeOnSelect={false}>
                    <MenuButton className='specialties' mt='5px' mb='5px' p='12px' fontSize='17px' fontWeight='400' borderRadius='7px' borderWidth='0px' bg='#998d8d' color='white' as={Button} colorScheme='blue'>
                        Specialties
                    </MenuButton>
                    <MenuList className='menuListOuterAddCompany'>
                        <MenuOptionGroup  type='checkbox' borderRadius='5px'>
                            <MenuItemOption className='menuOption' borderTopRadius='6px' value='PT' onClick={() => (addSpecialty('PT'))}>Physical Therapy (PT)</MenuItemOption>
                            <MenuItemOption className='menuOption' value='OT' onClick={() => (addSpecialty('OT'))}>Occupational Therapy (OT)</MenuItemOption>
                            <MenuItemOption className='menuOption' value='SLP' onClick={() => (addSpecialty('SLP'))}>Speech Therapy (SLP)</MenuItemOption>
                            <MenuItemOption className='menuOption' value='PTA' onClick={() => (addSpecialty('PTA'))}>Therapy Assistants (PTA)</MenuItemOption>
                            <MenuItemOption className='menuOption' borderBottomRadius='6px' value='COTA' onClick={() => (addSpecialty('COTA'))}>Certified Occupational Therapy Assistants</MenuItemOption>
                        </MenuOptionGroup>
                    </MenuList>
                </Menu>



                <Box className='locationsContainer' mt='25px'>
                    <Box align='center' fontSize='20px' fontWeight='700'>Locations</Box>
                    <Box align='center' fontSize='15px' pl='5px' pr='5px' fontWeight='400'>Make sure to add multiple locations if applicable to your company!</Box>
                    {Array(numLocations).fill(0).map((_ , i) => {
                        return (<Box key={i} mb='10px'>
                            <Box fontWeight='700'>Location {i + 1}:</Box>
                            <Flex maxW='100%' mb='-5px'>
                                <input className='addCompanyInput' id={`cityInput${i}`} type='text' placeholder='City' onInput={(e) => updateLocation(i, 'city', e.target.value)} />
                                <input className='addCompanyInput2' id={`stateInput${i}`} type='text' placeholder='State' onInput={(e) => updateLocation(i, 'state', e.target.value)} />
                            </Flex>
                            <input className='addCompanyInput3' id={`streetInput${i}`} type='text' placeholder='Street Address' onInput={(e) => updateLocation(i, 'street', e.target.value)} />
                            <Flex>
                                <input className='addCompanyInput4' id={`phoneInput${i}`} type='text' placeholder='Phone Number (no spaces)' onInput={(e) => updateLocation(i, 'phoneNumber', e.target.value)}/>
                                {renderAddClosePopup(i)}
                            </Flex>
                        </Box> ) 
                    })}
                    {
                        Array(1).fill(0).map((_, i) => {
                            if (numLocations > 1) return (
                                <Box className='addMoreLocationsButton' onClick={() => addLocationToList()} cursor='pointer' color='#0070f3' fontSize='45px' mt='-10px'><PlusSquareFill className='plusSquareFill' /></Box>
                            )
                        })
                    }

                </Box>


                <Box className='submitCompanyButton' w='100%' bg='#0070f3' fontSize='20px' mt='20px' fontWeight='800' align='center' p='15px' color='white' onClick={onSubmit}>
                    Add Company
                </Box>
            </Flex>
            <Box className='spacer' bg='#152f46' h='50vh'></Box>
            </FadeIn>
        </Box>
    )
}