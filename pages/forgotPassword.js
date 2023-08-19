import { Box, Flex } from '@chakra-ui/react'
import styles from '../styles/forgotPassword.module.css'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'
import { Spin, Popover } from 'antd';
import { InfoCircleFill } from 'react-bootstrap-icons';
import normalizeEmail from 'validator/lib/normalizeEmail';


export default function forgotPassword() {
    let router = useRouter()
    let [ emailInput, setEmailInput ] = useState('');
    let [ isSubmitted, setSubmitted ] = useState(false);

    async function onSubmit() {

//        emailInput = emailInput.replace('.', "");
//        emailInput = emailInput.toLowerCase();
        emailInput = normalizeEmail(emailInput);
      
        if (isSubmitted) return;
        console.log(emailInput);
        setSubmitted(true);

        let res = await fetch('/api/authentication/generateResetToken', {
            method: 'POST',
            headers: { email: emailInput },
        })
        let mes = (await res.json()).message
        setSubmitted(false);
        if (!res.ok) {
            toast.error(mes)
        } else {
            toast.success(mes);  
        }
    }

    const renderInfoPopover = () => {
        const content = (
            <Box w='200px'>
                Make sure your account is verified before requesting a reset. A reset can only be request at most once every 30 minutes.
            </Box>
        )
        return(<Popover content={content}>
            <InfoCircleFill className={styles.infoCircle} />
        </Popover>)
    }
    return (
        <Box bg='#143046'>
            <Box h='30px'></Box>
            <Flex justify='center'>
                <Box mt='20px' color='black' w='400px' bg='white' p='20px' borderRadius='7px'>
                    <Box align='center' fontSize='23px' fontWeight='600'>Forgot Password</Box>
                    <Box mt='5px' align='center'>Please enter the email used with your account below and we'll send an email to reset your password {renderInfoPopover()}</Box>
                    <Box mt='5px' align='center'><input className={styles.input} type='text' placeHolder='email' onInput={(e) => setEmailInput(e.target.value)} /></Box>
                    {Array(1).fill(0).map((_, ind) => {
                        if (isSubmitted) {
                            return (
                                <Box w='100%' bg='#78aae3' fontSize='20px' borderRadius='5px' mt='20px' fontWeight='800' align='center' p='15px' color='white' cursor='pointer' onClick={onSubmit}>
                                    <Spin />
                                </Box>)
                        }
                        return (
                            <Box className={styles.submitButton} w='100%' bg='#0070f3' fontSize='20px' borderRadius='5px' mt='20px' fontWeight='800' align='center' p='15px' color='white' cursor='pointer' onClick={onSubmit}>
                                Request Reset Password
                            </Box>
                        )
                    })}
                </Box>
            </Flex>
        </Box>
    )
}