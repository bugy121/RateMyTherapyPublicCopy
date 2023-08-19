import { Box, Flex } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { StateContext } from '../pages/_app'

export default function LoginPopup() {
    let {state, setState} = useContext(StateContext)
    let [ loginData, setLoginData ] = useState({})

    const changeLogin = () => {
        state.loginOpen = !(state.loginOpen)
        setState(JSON.parse(JSON.stringify(state)))
    }
    const updateLoginData = (e, field) => {
        loginData[field] = e.target.value
        setLoginData(JSON.parse(JSON.stringify(loginData)))
        console.log(loginData)
    }
    return (
        <Box className='loginPopup basicBoxShadow' w='26vw' bg='white'>
            <Box className='loginExit' onClick={changeLogin} m='8px' mr='10px'>X</Box>
            <Box align='center' fontSize='25px' mt='15px' className='signupTop'>Login To Write Reviews!</Box>

            <Flex justify='center' mt='10px'>
                <Box className='loginInputsContainer' w='60%'>
                    <Box m='10px'>Username or Email
                        <Box>
                            <input className='loginInput' type='text' onInput={(e) => updateLoginData(e, 'userNameEmail')}/>
                        </Box>
                    </Box>

                    <Box m='10px'>
                        Password
                        <Box>
                            <input className='loginInput' type='text' onInput={(e) => updateLoginData(e, 'password')}/>
                        </Box>
                    </Box>
                </Box>
            </Flex>


            <Flex justify='center'>
                <Box  textAlign='center' w='40%' bg='#FF7A7A' p='10px' m='10px' mb='22px' className='loginButton'>LOGIN</Box>
            </Flex>
        </Box>

    )
}