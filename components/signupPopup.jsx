import { Box, Flex } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { StateContext } from '../pages/_app'
export default function SignupPopup() {
    
    let { state, setState } = useContext(StateContext)
    
    const [ signupData, setSignupData ] = useState({})
    const changePopup = () => {
        state.signUpOpen = !(state.signUpOpen)
        setState(JSON.parse(JSON.stringify(state)))
    }
    const updateSignupData = (e, field) => {
        console.log(signupData)
        signupData[field] = e.target.value
        setSignupData(JSON.parse(JSON.stringify(signupData)))
    }
    return (
        <Box className='signUpPopupContainer basicBoxShadow' w='27vw' bg='white'>
            <Box className='signupExit' onClick={changePopup}>X</Box>
            <Box className='signupTop' align='center' fontSize='25px' mt='15px' mb='10px'>
                Register To Leave Reviews!
            </Box>
            
            <Box className='inputsContainer' ml='17%' w='90%'>

                <Box m='10px'>
                    First Name
                    <Box>
                    <input className='signupInput' type='text' onInput={(e) => updateSignupData(e, 'firstName')} />
                    </Box>
                </Box>

                <Box m='10px'>
                    Last Name
                    <Box>
                    <input className='signupInput' type='text' onInput={(e) => updateSignupData(e, 'lastName')}/>
                    </Box>
                </Box>

                <Box m='10px'>
                    Display Name
                    <Box>
                        <input className='signupInput' type='text' onInput={(e) => updateSignupData(e, 'displayName')}/>
                    </Box>
                </Box>

                <Box m='10px'>
                    Email
                    <Box>
                        <input className='signupInput' type='text' onInput={(e) => updateSignupData(e, 'email')}/>
                    </Box>
                </Box>

                <Box m='10px'>
                    Password
                    <Box>
                        <input className='signupInput' type='text' onInput={(e) => updateSignupData(e, 'password')}/>
                    </Box>
                </Box>

                <Box m='10px'>
                    Repeat Password
                    <Box>
                        <input className='signupInput' type='text' onInput={(e) => updateSignupData(e, 'repeatPassword')}/>
                    </Box>
                </Box>
                
            </Box>

            <Flex justify='center' mt='20px' mb='30px'>
                    <Box className='registerButton basicBoxShadow' w='60%' align='center' fontSize='25px' bg='#FF7A7A' p='7' pl='30' pr='30'>Register</Box>
                </Flex>
            
        </Box>
    )
}