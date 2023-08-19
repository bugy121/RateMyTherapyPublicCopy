import {Flex, Text, Box, Spacer} from '@chakra-ui/react'
import Link from 'next/link'
import SignupPopup from './signupPopup'
import { useState, useContext, useEffect, useRef, useCallback} from 'react'
import { StateContext } from '../pages/_app'
import LoginPopup from './loginPopup'
import Wrapper from './layout/wrapper'
import styles from './layout/nav.module.css'
import Container from './layout/Container'
import { useCurrentUser } from '../lib/user';
import { useRouter } from 'next/router';
import { Button, ButtonLink } from './Buttons/button';
import { Avatar } from '../components/avatar';
import toast, { Toaster } from 'react-hot-toast'
import Cookies from 'js-cookie'
import { totalmem } from 'os'
import Image from 'next/image'
import FadeIn from 'react-fade-in/lib/FadeIn'
import { Checkbox, CheckboxGroup, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'


/* TODO:
 need to set up a context
*/
const UserMenu = ({ user, mutate }) => {
    console.log('luke is wrong', user)

    let { state, setState } = useContext(StateContext)
    const router = useRouter();
    /*
    const { data, error, mutate} = useCurrentUser();
    useEffect(() => {
      if (!data && !error) return;
      if (!data.user) {
        router.replace('/login');
      }
    }, [router, data, error]);
    */

    const menuRef = useRef();
    const avatarRef = useRef();

    const [visible, setVisible] = useState(false);
  
    useEffect(() => {
      const onRouteChangeComplete = () => setVisible(false);
      router.events.on('routeChangeComplete', onRouteChangeComplete);
      return () =>
        router.events.off('routeChangeComplete', onRouteChangeComplete);
    });

    useEffect(() => {
      // detect outside click to close menu
      const onMouseDown = (event) => {
        if (
          !menuRef.current.contains(event.target) &&
          !avatarRef.current.contains(event.target)
        ) {
          setVisible(false);
        }
      };
      document.addEventListener('mousedown', onMouseDown);
      return () => {
        document.removeEventListener('mousedown', onMouseDown);
      };
    }, []);

 //   Cookies.set('userToken', '')
 //   router.replace('/homePage')

    const onSignOut = useCallback(async() => {
    //  try {
    //    await fetcher('/api/auth', {
    //      method: 'DELETE',
    //    });
      toast.success('You Have Been Signed Out')
      Cookies.set('userToken', '')
      state.buttonsOpen = false
      setState(JSON.parse(JSON.stringify(state)))
      router.replace('/homePage')
    //  } catch(e) {
    //    toast.error(e.message);
    //  }
      
    }, [mutate]);
    
return (
  <div className={styles.user} styles={{'z-index': 99999999999999999999}}>
    <button
      className={styles.trigger}
      ref={avatarRef}
      onClick={() => setVisible(!visible)}
    >
      {<Avatar size={50} username={user.username} url={user.profilePicture} />}
    </button>
    <div
      ref={menuRef}
      role="menu"
      aria-hidden={visible}
      className={styles.popover}
    >
      {visible && (
        <div className={styles.menu}>
          <Link passHref href={`/user/${user.username}`} className={styles.item}>
            Profile
          </Link>
          <Link passHref href="/settings" className={styles.item}>
              Settings
          </Link >
          <button onClick={onSignOut} className={styles.item}>
            Sign out
          </button>
        </div>
      )}  
    </div>
  </div>
);
};

function NavBar() {
  let { state, setState } = useContext(StateContext)
 // const { data: { user } = {} } = useCurrentUser();
 // const user = useCurrentUser();
 
  // const { data, error, mutate } = useCurrentUser();
  const user = state.user;
  const router = useRouter();
  /*
  useEffect(() => {
    if (!data && !error) return;
    if (!data.user) {
      router.replace('/login');
    }
  }, [router, data, error]);
  */
  

    let renderSignUp = () => {
        if (state.signUpOpen) {
            return <SignupPopup />
        }
    }
    let renderLogin = () => {
        if (state.loginOpen) {
            return <LoginPopup />
        }
    }
    const GoTo = (link) => {
      console.log('in the goto function', link)
      router.push(link)
    }

    return (
        <>
        <Box h='7vh' bg='#152f46'></Box>
            <Flex className='navShadow navv' h='75px' pt='15' m='0' w='100vw' color='white' alignItems='center' justify='center'>
              <Box w='16px'></Box>
              <FadeIn>
                <Image className='navImage coolBoxShadow' src='/images/logo_mini.png' alt='logo' height='50' width='75' />
              </FadeIn>

              <Box className='spacer' w='37%'></Box>

            <FadeIn>
              <Flex className='mainInfoBoxLarge' mb='18px' fontSize='17px' fontWeight='500'>
                <Box m='10' ml='0px' mr='15px'><Link className='navLink' href='/'>Home</Link></Box>
                <Box m='10' ml='15px' mr='15px'><Link className='navLink' href='/reviewPage'>Reviews</Link></Box>
                <Box m='10' ml='15px' mr='15px'><Link className='navLink' href='/addCompany'>Add&nbsp;Company</Link></Box>
                <Box m='10' ml='15px' mr='15px' w='103px'><Link className='navLink' href='/listings'>Job&nbsp;Listings</Link></Box>
                <Box m='10' ml='15px' mr='15px'><Link className='navLink' href='/blog'>Blog</Link></Box>
                <Box m='10' ml='15px' mr='15px'><Link className='navLink' href='/contact'>Contact</Link></Box>
              </Flex>
            </FadeIn>
    
            {/* This element should be hidden unless the screen is sufficiently small. view navBar.css */}
            <FadeIn>
              <Box className='mainInfoBoxSmall'>
              <Menu>
                <MenuButton mb='17px' border='0px' fontSize='20px' bg='#152f46' pb='3px' borderRadius='5px' fontWeight='900' color='white'><HamburgerIcon/></MenuButton>
                <MenuList >
                  <MenuItem className='navMenuItem'  borderTopWidth='1px' borderTopRadius='5px' onClick={() => GoTo('/')} >
                    <Box m='10' ml='15px' mr='15px'><Link className='navLink' href='/'>Home</Link></Box>
                  </MenuItem>
                  <MenuItem className='navMenuItem' onClick={() => GoTo('/reviewPage')}>
                    <Box m='10' ml='15px' mr='15px'><Link className='navLink' href='/reviewPage'>Reviews</Link></Box>
                  </MenuItem>
                  <MenuItem className='navMenuItem' onClick={() => GoTo('/addCompany')}>
                    <Box m='10' ml='15px' mr='15px'><Link className='navLink' href='/addCompany'>Add&nbsp;Company</Link></Box>
                  </MenuItem>
                  <MenuItem className='navMenuItem' onClick={() => GoTo('/listings')}>
                    <Box m='10' ml='15px' mr='15px' w='103px'><Link className='navLink' href='/listings'>Job Listings</Link></Box>
                  </MenuItem>
                  <MenuItem className='navMenuItem' onClick={() => GoTo('/blog')}>
                    <Box m='10' ml='15px' mr='15px' w='103px'><Link className='navLink' href='/blog'>Blog</Link></Box>
                  </MenuItem>
                  <MenuItem className='navMenuItem' borderBottomRadius='5px' onClick={() => GoTo('/contact')}>
                    <Box m='10' ml='15px' mr='15px'><Link className='navLink' href='/contact'>Contact</Link></Box>
                  </MenuItem>
                </MenuList>
              </Menu>
              </Box>
            </FadeIn>

              <Box className='spacer' w='23%'></Box>
            <FadeIn>
              {/* Changed some stuff here idk if it affects other stuff lmao -manny*/}
              <Box className='loginSignUpButtons' mr='16px' mb='15px'>
                  <Container>
                      {state.buttonsOpen && state.user? (   
                        
                      <Box ml='55px' w='65px'>
                        <UserMenu user={state.user}/> 
                      </Box>
                    ) : (
                    <>
                    <Box mr='5px'>
                      <Link className='noTextDecor' fontWeight='800' passHref href="/login">
                        <Box bg='#152f46' color='white' className='navLoginButton'>
                          Login
                        </Box>
                      </Link>
                    </Box>

                    <Box ml='5px'>
                      <Link fontWeight='800' className='noTextDecor' passHref href="/sign-up">
                        <Box bg='#152f46' color='white' className='navSignupButton'>
                          Sign&nbsp;Up
                        </Box>
                      </Link>
                    </Box>
                    </>
                  )}
                </Container>
            </Box>
          </FadeIn>
          </Flex>
        </>
    )
}

export default NavBar