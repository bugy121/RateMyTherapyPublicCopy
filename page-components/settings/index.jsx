import { Avatar } from '../../components/avatar';
import { Button } from '../../components/Buttons';
import { Input, Textarea } from '../../components/input';
import { Container, Spacer } from '../../components/layout';
import Wrapper from '../../components/layout/wrapper';
import { fetcher } from '../../lib/fetch';
import { useCurrentUser } from '../../lib/user';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState, useContext } from 'react';
import toast from 'react-hot-toast';
import styles from './settings.module.css';
import { Box, Flex } from '@chakra-ui/react'
import { StateContext } from '../../pages/_app'
import Cookies from 'js-cookie'
import { Spin } from 'antd'

/*
const EmailVerify = ({ user }) => {
  const [status, setStatus] = useState();
  const verify = useCallback(async () => {
    try {
      setStatus('loading');
      await fetcher('/api/user/email/verify', { method: 'POST' });
      toast.success(
        'An email has been sent to your mailbox. Follow the instruction to verify your email.'
      );
      setStatus('success');
    } catch (e) {
      toast.error(e.message);
      setStatus('');
    }
  }, []);
  if (user.emailVerified) return null;
  return (
    <section className={styles.card}>
    <Container className={styles.note}>
      <Container flex={1}>
        <p>
          <strong>Note:</strong> <span>Your email</span> (
          <span className={styles.link}>{user.email}</span>) is unverified.
        </p>
      </Container>
      <Spacer size={1} axis="horizontal" />
      <Button
        loading={status === 'loading'}
        size="small"
        onClick={verify}
        disabled={status === 'success'}
      >
        Verify
      </Button>
    </Container>
    </section>
  );
};
*/

const Auth = () => {
  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await fetcher('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: oldPasswordRef.current.value,
          newPassword: newPasswordRef.current.value,
        }),
      });
      toast.success('Your password has been updated');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
      oldPasswordRef.current.value = '';
      newPasswordRef.current.value = '';
    }
  }, []);

  return (
    <section className={styles.card}>
      <h4 className={styles.sectionTitle}>Password</h4>
      <form onSubmit={onSubmit}>
        <Input
          htmlType="password"
          autoComplete="current-password"
          ref={oldPasswordRef}
          label="Old Password"
        />
        <Spacer size={0.5} axis="vertical" />
        <Input
          htmlType="password"
          autoComplete="new-password"
          ref={newPasswordRef}
          label="New Password"
        />
        <Spacer size={0.5} axis="vertical" />
        <Button
          htmlType="submit"
          className={styles.submit}
          type="success"
          loading={isLoading}
        >
          Save
        </Button>
      </form>
    </section>
  );
};

const AboutYou = ({ user/*, mutate*/ }) => {
  const usernameRef = useRef();
  const nameRef = useRef();
  const bioRef = useRef();
  const profilePictureRef = useRef();

  const [avatarHref, setAvatarHref] = useState(user.profilePicture);
  const onAvatarChange = useCallback((e) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (l) => {
      setAvatarHref(l.currentTarget.result);
    };
    reader.readAsDataURL(file);
  }, []);


  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = useCallback(
    
 /*   async (e) => {
      var formdata = new FormData();
      formdata.append("file", profilePictureRef.current.files[0], "[PROXY]");
      formdata.append("upload_preset", "<yourUploadPreset>");
      formdata.append("public_id", "<yourPublicId>");
      formdata.append("api_key", "{{api_key}}");
      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };
      fetch("https://api.cloudinary.com/v1_1/{{cloud_name}}/image/upload", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }
  )
  }
  */
    async (e) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        let formData = new FormData();
        // appends formData
        formData.append("username", usernameRef.current.value);
        formData.append("name", nameRef.current.value);
        formData.append("bio", bioRef.current.value);

//        console.log(formData.entries());
//        console.log(usernameRef.current.value);

        // if profile picture changes it uploads it to cloudinary
        /*
        if (profilePictureRef.current.files[0]) {
          const image = await cloudinary.uploader.upload(profilePictureRef.current.files[0].path, {
            width: 512,
            height: 512,
            crop: 'fill',
          });
          profileurl = image.secure_url;
        }
        console.log(profileurl);
      */

     
        
        if (profilePictureRef.current.files[0]) {
        /*}
         profileData.append('file', profilePictureRef.current.files[0]);
          profileData.append('upload_preset', 'profile');
          const data = await fetch('https://api.cloudinary.com/v1_1/dmrunuanc/image/upload', {
            method: 'POST',
            body: profileData
        }).then(r => r.json())
          console.log(profileurl)
      */
          formData.append('profilePicture', profilePictureRef.current.files[0]);
        }
    
        for (var key of formData.entries()) {
          console.log("FORM DATA " + key[0] + ', ' + key[1]);}
        
        // patches the form data into new user
        const response = await fetcher('/api/user', {
          headers: {
            token: Cookies.get('userToken'),
  //          "Content-Type": "multipart/form-data"
        },
          method: 'PATCH',
          body: formData
        });
    //    let body = await response.json()
    /*    
    if (!response.ok) {
          toast.error(body.message)
          return
        }
        */
    //    mutate({ user: response.user }, false);
        toast.success('Your profile has been updated');
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    },
//    [mutate]
  );
  
  let [ resendEmailButtonLoading, setResendEmailButtonLoading] = useState(false)

  useEffect(() => {
    usernameRef.current.value = user.username;
    nameRef.current.value = user.name;
    bioRef.current.value = user.bio;
    setAvatarHref(user.profilePicture);
  }, [user]);

  
  const resendEmail = async () => {
    if (resendEmailButtonLoading) return
    setResendEmailButtonLoading(true)
    let response = await fetch("/api/authentication/resendVerificationEmail", {
      method: "POST",
      headers: { token: Cookies.get("userToken") }
    })
    let data = await response.json()
    
    if (!response.ok) {
      toast.error(data.message)
    } else {
      toast.success(data.message)
    }
    setResendEmailButtonLoading(false)

  }
  return (
    <>
    {!user.emailVerified && (
      <section className={styles.card} style={{ position: 'relative'}}>
        <Box className={styles.outerResendEmailContainer}>
          <Box className={styles.sectionTitle}
            fontSize='17px' 
            p='12px'
            >Email is not verified</Box>
          <Box className={styles.resendEmailButton}
            bg='#17cc95' 
            p='12px'
            h='50px' 
            borderRadius='10px'
            color='white'
            fontWeight='500'
            display='inline-block'
            cursor='pointer'
            onClick={() => resendEmail()}
          >
            { resendEmailButtonLoading ? <Spin className={styles.spinner} /> : "resend verification email"}
          </Box>
        </Box>
      </section>
    )}
    <section className={styles.card}>
      <h4 className={styles.sectionTitle}>About You</h4>
      <form onSubmit={onSubmit}>
        <Input ref={usernameRef} label="Your Username" />
        <Spacer size={0.5} axis="vertical" />
        <Input ref={nameRef} label="Your Name" />
        <Spacer size={0.5} axis="vertical" />
        <Textarea ref={bioRef} label="Your Bio" />
        <Spacer size={0.5} axis="vertical" />
        <span className={styles.label}>Your Avatar</span>
        <div className={styles.avatar}>
          <Avatar size={96} username={user.username} url={avatarHref} />
          <input
            aria-label="Your Avatar"
            type="file"
            accept="image/*"
            ref={profilePictureRef}
            onChange={onAvatarChange}
          />
        </div>
        <Spacer size={0.5} axis="vertical" />
        <Button
          htmlType="submit"
          className={styles.submit}
          type="success"
          loading={isLoading}
        >
          Save
        </Button>
      </form>
    </section>
    </>
  );
};

export const Settings = () => {
  let { state, setState } = useContext(StateContext);
 // const { data, error, mutate } = useCurrentUser();
  const router = useRouter();
  const user = state.user;
  /*
  useEffect(() => {
    if (!data && !error) return;
    if (!data.user) {
      router.replace('/login');
    }
  }, [router, data, error]);
*/
  return (
    <Box h='1050px' bg='#152f46'>
    <Wrapper className={styles.wrapper}> 
      <Spacer size={2} axis="vertical" /> 
      {user? (
        <>
          {/*  <EmailVerify user={data.user} />  */}
          <AboutYou user={user} />
          <Auth user={user} />
        </>
      ) : null}
    </Wrapper> 
    </Box>
  );
};