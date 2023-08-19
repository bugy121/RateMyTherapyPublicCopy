
import { Button } from '../components/Buttons';
import { Input } from '../components/input';
import { Container, Spacer, Wrapper } from '../components/layout';
import { TextLink } from '../components/text';
import { fetcher } from '../lib/fetch';
import { useCurrentUser } from '../lib/user';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState, useContext } from 'react';
import toast from 'react-hot-toast';
import styles from '../page-components/auth/auth.module.css';
import Head from 'next/head';
import mongoose from 'mongoose'
import Cookies from 'js-cookie'
import { StateContext } from './_app';
import { Box, Flex } from '@chakra-ui/react'

async function getLoggedIn(state, setState) {
  let res = await fetch('/api/getLoggedIn', {
      method: 'GET',
      headers: {token: Cookies.get('userToken')},
  })
  let body = await res.json()
  if (res.ok) {
    state.user = body.user
    state.buttonsOpen = true;
  }
  console.log(state.user)
  setState(JSON.parse(JSON.stringify(state)))
}

const SignUp = () => {

  let { state, setState } = useContext(StateContext)
  const passwordRef2 = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();
  const nameRef = useRef();
;
  const { mutate } = useCurrentUser();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState()

  const router = useRouter();

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        const res = await fetch('/api/authentication/sign-up', {
          method: 'POST',
          body: JSON.stringify({
            email: emailRef.current.value,
            name: nameRef.current.value,
            password: passwordRef.current.value,
            username: usernameRef.current.value
          })
        })
        let body = await res.json()

        if (!res.ok) {
          toast.error(body.message)
          return
        }
        handleToken(body)

        router.replace('/homePage')
        toast.success('your account has been created')
        return
        /*
        if (passwordRef.current.value == passwordRef2.current.value){
        setIsLoading(true);
        const response = await fetcher('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: emailRef.current.value,
            name: nameRef.current.value,
            password: passwordRef.current.value,
            username: usernameRef.current.value,
          }),
        });
        handleToken(response)
        await getLoggedIn(state, setState)
        //mutate({ user: response.user }, false);
        toast.success('Your account has been created');
        router.replace('/homePage');
      }
      else{
        toast.error('Passwords must match')
        router.replace('/homePage');
      }
      */
      } catch (e) { 
      //  console.log("this is the error here: ")
      //  console.log(e);
      //  toast.error(e.message);
      toast.success('Your account has been created')
      } finally {
        setIsLoading(false);
      }
    },
    [mutate, router]
  );

  function handleToken(body) {
    Cookies.set('userToken', body.token)
    state.user = body.user
    state.buttonsOpen = true;
  }

//       <div className={styles.main}>
//       </div>

  return (
    <>
    <Box bg='#152f46'>
    <Box h = '50px'></Box>
      <Head>
        <title>Sign up</title>
      </Head>
      <Wrapper className={styles.root}>
      <section className={styles.card}>

        <h1 className={styles.title}>Join Now</h1>
        <form onSubmit={onSubmit}>

          <Container alignItems="center">
            <p className={styles.subtitle}>Your login</p>
            <div className={styles.seperator} />
          </Container>
          <Input
            ref={emailRef}
            htmlType="email"
            autoComplete="email"
            placeholder="Email Address"
            ariaLabel="Email Address"
            size="large"
            required
          />
          <Spacer size={0.5} axis="vertical" />
          <Input
            ref={passwordRef}
            htmlType="password"
            autoComplete="new-password"
            placeholder="Password"
            ariaLabel="Password"
            size="large"
            required
          />
          <Spacer size={0.5} axis="vertical" />
          <Input
            ref={passwordRef2}
            htmlType="password"
            autoComplete="retype-password"
            placeholder="Retype Password"
            ariaLabel="Retype Password"
            size="large"
            required
          />
          <Spacer size={0.75} axis="vertical" />
          <Container alignItems="center">
            <p className={styles.subtitle}>About you</p>
            <div className={styles.seperator} />
          </Container>
          <Input
            ref={usernameRef}
            autoComplete="username"
            placeholder="Username"
            ariaLabel="Username"
            size="large"
            required
          />
          <Spacer size={0.5} axis="vertical" />
          <Input
            ref={nameRef}
            autoComplete="name"
            placeholder="Your name"
            ariaLabel="Your name"
            size="large"
            required
          />
          <Spacer size={1} axis="vertical" />
          <Button
            htmlType="submit"
            className={styles.submit}
            type="success" 
            size="large"
            loading={isLoading}
          >
            Sign up
          </Button>
        </form>
      </section>
      <div className={styles.footer}>
        <Link href="/login" passHref>
          <TextLink color="link" variant="highlight">
            Already have an account? Log in
          </TextLink>
        </Link>
      </div>
    </Wrapper>
    </Box>
    </>
  );
};

export default SignUp;