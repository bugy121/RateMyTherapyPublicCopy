import Head from 'next/head';
import { Button } from '../components/Buttons';
import { ButtonLink } from '../components/Buttons/button';
import { Input } from '../components/input';
import { Spacer, Wrapper } from '../components/layout';
import { TextLink } from '../components/text';
import { fetcher } from '../lib/fetch';
import { useCurrentUser } from '../lib/user';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState, useContext} from 'react';
import toast from 'react-hot-toast';
import styles from '../page-components/auth/auth.module.css';
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

const Login = () => {
  let { state, setState } = useContext(StateContext)

  const emailRef = useRef();
  const passwordRef = useRef();

  const [isLoading, setIsLoading] = useState(false);

  const { data: { user } = {}, mutate, isValidating } = useCurrentUser();
  const router = useRouter();
  useEffect(() => {
    //if (isValidating) return;
    //if (user) router.replace('/homePage');
  }, /* [user, router, isValidating] */);

  const onSubmit = useCallback(
    async (event) => {
      setIsLoading(true);
      event.preventDefault();
      try {
        const response = await fetcher('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: emailRef.current.value,
            password: passwordRef.current.value,
          }),
        });
        handleToken(response)

//        mutate({ user: response.user }, false);
        toast.success('You have been logged in.');
        router.replace('/homePage')
      } catch (e) {
        toast.error('Incorrect email or password.');
      } finally {
        setIsLoading(false);
      }

      //new code
      await getLoggedIn(state, setState)
    },
    [mutate]
  );

  function handleToken(response) {
    Cookies.set('userToken', response.token)
    state.buttonsOpen = true;
    setState(JSON.parse(JSON.stringify(state)))
  }
 // <div className={styles.main}>
 // </div>

  return (
    <Box bg='#152f46'>
    <Wrapper className={styles.root}>
    <section className={styles.card}>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={onSubmit}>
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
            autoComplete="current-password"
            placeholder="Password"
            ariaLabel="Password"
            size="large"
            required
          />
          <Spacer size={0.5} axis="vertical" />
          <Button
            htmlType="submit"
            className={styles.submit}
            type="success"
            size="large"
            loading={isLoading}
          >
            Log in
          </Button>
          {/*
          <Spacer size={0.25} axis="vertical" />
          <Link href="/forget-password" passHref>
            <ButtonLink type="success" size="large" variant="ghost">
              Forget password
            </ButtonLink>
          </Link>
  */}
        </form>
      </section>
      <div className={styles.footer}>
        <Link href="/sign-up" passHref>
          <TextLink color="link" variant="highlight">
            Don&apos;t have an account? Sign Up
          </TextLink>
        </Link>
        <Box ml='10px'>
          <Link href='/forgotPassword'>Forgot Password?</Link>
        </Box>
      </div>
    </Wrapper>
    </Box>
  );
};

export default Login;