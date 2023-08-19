import { Box, Flex } from '@chakra-ui/react'
import { useState } from 'react'
import styles from '../styles/resetPassword.module.css'
import { useRouter } from 'next/router'
import { Spin } from 'antd'
import {toast } from 'react-hot-toast'

export default function resetPassword() {
    let router = useRouter()
    let [ emailInput, setEmailInput ] = useState('')
    let [ passwordInput, setPasswordInput ] = useState('')
    let [ isSubmitted, setSubmitted ] = useState(false);

    async function onSubmit() {

        /* Debugging
        console.log(emailInput)
        console.log(passwordInput)
        console.log(router.query.key)
        */
        
        setSubmitted(true);
        let res = await fetch('/api/authentication/resetPassword', {
            method: 'POST',
            body: JSON.stringify({
                password: passwordInput,
                secret_key: router.query.key,
                email: emailInput
            })
        })

        let mes = (await res.json()).message
        setSubmitted(false);
        if (!res.ok) {
            toast.error(mes)
        } else {
            toast.success(mes);
            router.push('/');
        }

    }
    return (
        <Box bg='#143046'>
            <Box h='20px'></Box>
            <Flex justify='center'>
                <Box mt='20px' color='black' w='400px' bg='white' p='20px' borderRadius='7px'>
                    <Box align='center' fontSize='23px' fontWeight='600'>Reset Password</Box>
                    <Box mt='5px' align='center'>Verify your email below and write your new password</Box>
                    <Box align='center'><input className={styles.input} type='text' placeholder='email' onInput={(e) => setEmailInput(e.target.value)} /></Box>
                    <Box align='center'><input className={styles.input} type='text' placeholder='new password' onInput={(e) => setPasswordInput(e.target.value)} /></Box>

                    {Array(1).fill(0).map((_, ind) => {
                        if (isSubmitted) return (
                            <Box w='100%' bg='#78aae3' fontSize='20px' borderRadius='5px' mt='20px' fontWeight='800' align='center' p='15px' color='white' cursor='pointer' onClick={onSubmit}>
                                <Spin />
                            </Box>
                        )
                        return (
                            <Box className={styles.submitButton} w='100%' bg='#0070f3' fontSize='20px' borderRadius='5px' mt='20px' fontWeight='800' align='center' p='15px' color='white' cursor='pointer' onClick={onSubmit}>
                                Reset Password
                            </Box>
                        )
                    })}
                </Box>
            </Flex>
        </Box>
    )
}