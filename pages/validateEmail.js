import { Box, Flex } from '@chakra-ui/react'
import styles from '../styles/validateEmail.module.css'
import { Spin } from 'antd'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { CheckCircleFill, XCircleFill } from 'react-bootstrap-icons'

export default function validateEmail() {
    let router = useRouter()
    let [ isProcessing, setProcessing ] = useState({val: true})
    let [ message, setMessage ] = useState('')
    let [ ok, setOk ] = useState(false)
    useEffect(() => {
        if (!router.isReady) return
        
        fetch('/api/authentication/validateEmail', {
            method: 'POST',
            body: JSON.stringify({
                email: router.query.email,
                secretKey: router.query.key
            })
        }).then((res) => {
            setOk(res.ok)
            return res.json()
        }).then((data) => {
            console.log(data)
            setProcessing({...isProcessing, val: false})
            setMessage(data.message);
        })

        console.log(router.query)
    }, [router.isReady])

    const flag = () => {
        if (ok) {
            return (<CheckCircleFill className={styles.checkCircle}/>)
        } else {
            return (<XCircleFill className={styles.XCircle} />)
        }
    }

    return (
        <Box bg='#152f46'>
            <Box h='90px'></Box>
            <Flex justify='center'>
                {Array(1).fill(0).map((_) => {
                    if (isProcessing.val) {
                        return (<Box p='20px' borderRadius='8px' fontSize='17px' fontWeight='700' bg='white' color='black'>Verifying Email <Spin className={styles.spinner} /> </Box>)
                    } else {
                        return (<Box p='20px' borderRadius='8px' fontSize='17px' fontWeight='700' bg='white' color='black'>{message} {flag()}</Box>)
                    }
                })}
            </Flex>
        </Box>
    )
}