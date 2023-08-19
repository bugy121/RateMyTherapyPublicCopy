import { Box, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import styles from '../styles/addLocation.module.css'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Cookies from 'js-cookie'

/* Page for Adding a location to an existing company */
/*
    TODO:
    implement the form (should be small and easy)
    implement backend logic for appengind the new location
*/

export default function addLocation() {

    //initialization stuff
    let router = useRouter()
    let [comp, setComp] = useState({})
    let [formData, setFormData] = useState({
        city: '',
        state: '',
        street: '',
        phoneNumber: ''
    })
    useEffect(() => {
        if(!router.isReady) return;
        fetch('/api/getCompanyByID', {
            method: 'GET',
            headers: {
                _id: router.query.id
            }
        }).then((response) => response.json()).then(
            (data) => {
                setComp(JSON.parse(JSON.stringify(data.company)))
            }
        )
    }, [router.isReady])


    //make request to db, then redirect/send error to the user
    async function onSubmit() {
        let res = await fetch('/api/addLocation', {
            method: 'POST',
            headers: {token: Cookies.get('userToken')},
            body: JSON.stringify({
                location: formData,
                companyID: router.query.id
            })
        })
        let mes = await res.json()
        if (!res.ok) {
            toast.error(mes.message)
        } else {
            toast.success('successfully added company')
            router.replace('/')
        }
    }


    return (
        <Box bg='#152f46'>
            <Box h='30px'></Box>
            <Box></Box>
            
            <Flex justify='center'>
                <Box className={styles.formContainer} bg='white' align='center' p='20px' borderRadius='10px'>
                    
                    <Box className={styles.titleContainer} bg='#ede4ba' p='5px' pt='10px' pb='10px' borderRadius='8px'>
                        <Box fontSize='17px' fontWeight='400'>Add A Location for:</Box>
                        <Box fontSize='25px' fontWeight='700' w='95%'>{(comp.companyName == undefined? 'Loading...' : comp.companyName)}</Box>
                    </Box>
                    <Box h='10px'></Box>
                    <Flex>
                        <input className={styles.input} type='text' placeholder='city' onInput={(e) => setFormData({...formData, city: e.target.value})}/>
                        <Box w='10px'></Box>
                        <input className={styles.input}  type='text' placeholder='state' onInput={(e) => setFormData({...formData, state: e.target.value})}/>
                    </Flex>
                    <Box>
                        <input className={styles.input}  type='text' placeholder='street address' onInput={(e) => setFormData({...formData, street: e.target.value})}/>
                    </Box>
                    <Box>
                        <input className={styles.input}  type='text' placeholder='phoneNumber (optional)' onInput={(e) => setFormData({...formData, phoneNumber: e.target.value})}/>
                    </Box> 

                    <Box className={styles.addLocationButton} onClick={onSubmit} w='100%' bg='#0070f3' fontSize='20px' borderRadius='5px' mt='20px' fontWeight='800' align='center' p='15px' color='white'>
                        Add Location
                    </Box>
                </Box>
            </Flex>

        </Box>
    )
}